<script lang="ts">
  import Dropzone from 'svelte-file-dropzone';

  import { uploadImage } from "./utils";

  let canvas;
  $: context = canvas && canvas.getContext('2d');

  const drawObjectsBorders = (objects) => {
    for (const object of objects) {
      const objectTitle = `${object.name} (${(object.score * 100).toFixed(2)}%)`;
      context.beginPath();
      const startPosition = object.boundingPoly.normalizedVertices[0];
      context.moveTo(
        startPosition.x * canvas.width,
        startPosition.y * canvas.height
      );
      context.font = `${32 * (canvas.width / 1000)}px Arial`;
      context.fillStyle = 'rgba(225,225,225,0.8)';
      const width = context.measureText(objectTitle).width;
      context.fillRect(startPosition.x * canvas.width, startPosition.y * canvas.height, width, -100);
      context.fillStyle = 'green';
      context.fillText(
        objectTitle,
        startPosition.x * canvas.width,
        startPosition.y * canvas.height - 20
      );
      for (let i = 1; i < object.boundingPoly.normalizedVertices.length; i++) {
        const pos = object.boundingPoly.normalizedVertices[i];
        context.lineTo(pos.x * canvas.width, pos.y * canvas.height);
      }
      context.lineTo(
        startPosition.x * canvas.width,
        startPosition.y * canvas.height
      );
      context.lineWidth = 5;
      context.strokeStyle = '#00ff00';
      context.stroke();
    }
  };

  const processImage = async (image: string) => {
    const data = await uploadImage(image);

    if (data?.responses?.length) {
      const objects = data.responses[0];
      const localizedObjectAnnotations = objects.localizedObjectAnnotations;
      drawObjectsBorders(localizedObjectAnnotations);
    }
  };

  const onFileSelected = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        processImage(e.target.result);
      };
      img.src = e.target.result;
    };
  };

  function handleFilesSelect(e) {
    const { acceptedFiles } = e.detail;

    if (acceptedFiles.length) {
      onFileSelected(acceptedFiles[0]);
    }
  }
</script>

<section class="text-gray-600 body-font relative">
  <div class="container px-5 py-24 mx-auto flex space-x-8">
    <div class="lg:w-1/3 md:w-1/2">
      <Dropzone
        containerClasses="h-full w-full"
        accept={["image/*"]}
        on:drop={handleFilesSelect}
        multiple={false}
      >
        <div class="flex h-full items-center text-black text-center">
          <p>Choose an image or drag it here</p>
        </div>
      </Dropzone>
    </div>
    <div class="lg:w-2/3 md:w-1/2 border-2 border-gray-400 rounded-lg p-5">
      <canvas
        bind:this={canvas}
        style=" max-height:800px; width:100%"
        class="object-contain"
      />
    </div>
  </div>
</section>
