import AsyncStorage from '@react-native-community/async-storage';
import {Toast} from 'native-base';
// import ImagePicker from 'react-native-image-picker';
const options = {
  title: 'Profile Picture',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
const toastr = (message, type) => {
  Toast.show({
    text: message,
    buttonText: 'Okay',
    type,
  });
};

const sessionCheck = async _ => {
  try {
    return await AsyncStorage.getAllKeys().length;
  } catch (err) {
    return 0;
  }
};

const clearSession = async callback => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    toastr('Ops, something error');
  }

  callback();
};

const getDataStorage = async (item, callback) => {
  try {
    const value = await AsyncStorage.getItem(item);
    callback(value);
  } catch (err) {
    callback(null);
  }
};

const getMultipleDataStorage = async (item, callback) => {
  let value;
  try {
    value = await AsyncStorage.multiGet(item);
  } catch (err) {
    callback(null);
  }
  callback(value);
};

function timeConverter(menit) {
  const hari = 60 * 24;
  const bulan = hari * 30;
  const tahun = bulan * 12;
  if (menit > tahun) {
    return `${Math.round(menit / tahun)} years ago`;
  }
  if (menit > bulan) {
    return `${Math.round(menit / bulan)} months ago`;
  }
  if (menit > hari) {
    return `${Math.round(menit / hari)} days ago`;
  }
  if (menit > 60) {
    return `${Math.round(menit / 60)} hours ago`;
  }
  if (menit === 0) {
    return 'A few seconds ago';
  }
  return 'A few minutes ago';
}

function validExtension(ext, acceptableExts) {
  // eslint-disable-next-line no-unused-vars
  for (const acceptExt of acceptableExts) {
    if (acceptExt === ext) {
      return true;
    }
  }
  return false;
}

function validateImage(fileName, fileSize) {
  const split = fileName.split('.');
  const ext = split[split.length - 1].toLocaleLowerCase();
  const acceptableExts = ['png', 'jpg', 'jpeg'];
  if (validExtension(ext, acceptableExts) !== true) {
    toastr('Image not accepted.');
  } else if (fileSize > 1024 * 1024) {
    toastr('Image too large. Max: 1mb');
  } else {
    return true;
  }
}

// function launchImageLibrary(callback) {
//   ImagePicker.launchImageLibrary(options, res => {
//     if (!res.didCancel && !res.error && !res.customButton) {
//       const {fileName, fileSize} = res;
//       const isValid = validateImage(fileName, fileSize);
//       if (isValid) {
//         callback(res);
//       }
//     }
//   });
// }

export {
  timeConverter,
  validExtension,
  validateImage,
  //   launchImageLibrary,
  sessionCheck,
  clearSession,
  getDataStorage,
  getMultipleDataStorage,
  toastr,
};