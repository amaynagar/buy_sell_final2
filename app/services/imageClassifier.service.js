const tf = require("@tensorflow/tfjs");
const mobilenet = require("@tensorflow-models/mobilenet");
const jpeg = require("jpeg-js");
const { PNG } = require("pngjs");

const CATEGORY_KEYWORDS = {
  laptop: ["laptop", "notebook", "computer", "macbook"],
  mobile: ["cellular telephone", "cell phone", "mobile phone", "smartphone", "iphone"],
  car: ["car", "sports car", "convertible", "jeep", "limousine", "minivan", "cab"],
  furniture: ["sofa", "couch", "chair", "table", "wardrobe", "bench", "bookcase", "cabinet", "desk"],
  electronics: ["computer", "monitor", "keyboard", "mouse", "television", "tv", "speaker", "headphone", "camera"],
  clothes: ["jean", "trouser", "shirt", "t-shirt", "jacket", "coat", "dress", "sweatshirt", "sneaker", "shoe"]
};

let mobileNetModel = null;

async function getModel() {
  if (!mobileNetModel) {
    mobileNetModel = await mobilenet.load({ version: 2, alpha: 1.0 });
  }
  return mobileNetModel;
}

function decodeImageToTensor(buffer, mimeType) {
  let decoded;
  const normalizedType = String(mimeType || "").toLowerCase();

  if (normalizedType.includes("png")) {
    decoded = PNG.sync.read(buffer);
  } else {
    decoded = jpeg.decode(buffer, { useTArray: true });
  }

  const { data, width, height } = decoded;
  const rgbData = new Uint8Array(width * height * 3);

  for (let src = 0, dst = 0; src < data.length; src += 4) {
    rgbData[dst++] = data[src];
    rgbData[dst++] = data[src + 1];
    rgbData[dst++] = data[src + 2];
  }

  return tf.tensor3d(rgbData, [height, width, 3], "int32");
}

async function classifyImage(buffer, mimeType) {
  const model = await getModel();
  const imageTensor = decodeImageToTensor(buffer, mimeType);

  try {
    return await model.classify(imageTensor);
  } finally {
    imageTensor.dispose();
  }
}

function imageMatchesCategory(predictions, category) {
  const keywords = CATEGORY_KEYWORDS[category] || [];

  if (keywords.length === 0) {
    return true;
  }

  const labels = predictions.map((prediction) => prediction.className.toLowerCase());
  return labels.some((label) => keywords.some((keyword) => label.includes(keyword)));
}

module.exports = {
  CATEGORY_KEYWORDS,
  classifyImage,
  imageMatchesCategory
};
