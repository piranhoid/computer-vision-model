declare const GOOGLE_VISION_API_KEY;
declare const OBJECT_LOCALIZATION_MAX_RESULTS;

export const uploadImage = async (image : string) => {
  const b64Image = image.replace('data:image/jpeg;base64,', '');
  const request = {
    requests: [
      {
        image: { content: b64Image },
        features: [
          {
            type: 'OBJECT_LOCALIZATION',
            maxResults: OBJECT_LOCALIZATION_MAX_RESULTS,
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  );
  return await response.json();
}