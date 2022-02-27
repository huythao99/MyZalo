// signup api

import axios from 'axios';
import {Voximplant} from 'react-native-voximplant';
import {
  VOX_APP_ID,
  VOX_ACC_ID,
  VOX_API_KEY,
  VOX_ACC_NAME,
  VOX_APP_NAME,
} from '../constants/constants';

const signupVox = async ({
  username,
  displayname,
  password,
}: {
  username: string;
  displayname: string;
  password: string;
}) => {
  try {
    await axios.get('https://api.voximplant.com/platform_api/AddUser/', {
      params: {
        user_name: username,
        user_display_name: displayname,
        user_password: password,
        application_id: VOX_APP_ID,
        account_id: VOX_ACC_ID,
        api_key: VOX_API_KEY,
      },
    });
  } catch (error) {
    throw error;
  }
};

const signinVox = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const voximplant = Voximplant.getInstance();
    const fqUsername = `${username}@${VOX_APP_NAME}.${VOX_ACC_NAME}.voximplant.com`;
    await voximplant.login(fqUsername, password);
  } catch (error) {
    throw error;
  }
};

export {signupVox, signinVox};
