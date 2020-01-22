import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text as TextMedium,
  View,
  ImageBackground,
} from 'react-native';
import {
  Container,
  Content,
  Text,
  H2,
  H3,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Button,
} from 'native-base';
import Modal from 'react-native-modal';
import {
  removeDataStorage,
  getMultipleDataStorage,
  toastr,
  clearSession,
} from '../../helpers/script';
import sGlobal from '../../public/styles';
import sColor from '../../public/styles/color';
import color from '../../config';
import axios from 'axios';
import {BASE_URL, API_ENDPOINT} from 'react-native-dotenv';

export default function Profile({
  navigation: {
    navigate,
    push,
    state: {params = 0},
  },
}) {
  const update = params === 0 ? 0 : params.update;
  let [data, setData] = useState({});
  let [deleteModal, setDeleteModal] = useState(false);
  let [config, setConfig] = useState({error: false, loading: false});
  useEffect(() => {
    getMultipleDataStorage(['id', 'token'], values => {
      const id = values[0][1];
      const token = values[1][1];
      setConfig({loading: true, error: false});
      axios
        .get(`${API_ENDPOINT}profile/${id}`)
        .then(res => {
          setConfig({loading: false, error: false});
          setData({...res.data.data[0], token});
        })
        .catch(() => {
          setConfig({loading: false, error: true});
          toastr('Ops, network error');
        });
    });
  }, [update]);
  const signOut = () => {
    removeDataStorage('token', err => {
      if (!err) {
        navigate('Auth');
      }
    });
  };
  const deleteAccount = () => {
    axios
      .delete(`${API_ENDPOINT}profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + data.token,
        },
        data: {user_id: data.user_id},
      })
      .then(() => {
        setConfig({loading: false, error: false});
        setDeleteModal(false);
        clearSession(() => navigate('Auth'));
      })
      .catch(() => {
        setConfig({loading: false, error: true});
        setDeleteModal(false);
        toastr('Ops, network error');
      });
  };
  return (
    <Container>
      <Modal
        onBackButtonPress={() => setDeleteModal(false)}
        onBackdropPress={() => setDeleteModal(false)}
        animationIn="pulse"
        animationOut="fadeOut"
        isVisible={deleteModal}>
        <View style={[sColor.lightBgColor, s.modal]}>
          <View>
            <H3 style={[sColor.dangerColor, sGlobal.textCenter]}>
              Delete Account
            </H3>
            <TextMedium style={[sGlobal.textCenter, s.modalMessage]}>
              Are you sure to delete this account?
            </TextMedium>
            <View>
              <View style={sGlobal.flexRow}>
                <Button
                  danger
                  style={[sGlobal.w1_2, sGlobal.center, s.modalButton]}
                  onPress={deleteAccount}>
                  <Text>Delete</Text>
                </Button>
                <Button
                  light
                  style={[sGlobal.w1_2, sGlobal.center, s.modalButton]}
                  onPress={() => setDeleteModal(false)}>
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Content>
        <View style={[sColor.secondaryBgColor, s.banner]}>
          <View style={[sGlobal.center, s.imgContainer]}>
            <View style={s.imgView}>
              <ImageBackground
                source={require('../../public/images/seller-no-photo.png')}
                imageStyle={s.imgCircle}
                style={[s.img, s.border, s.imgCircle]}>
                <ImageBackground
                  source={{
                    uri: `${BASE_URL}images/profile/${data.photo_profile}`,
                  }}
                  imageStyle={s.imgCircle}
                  style={s.img}
                />
              </ImageBackground>
            </View>
          </View>
          <H2 style={[sGlobal.textCenter, sColor.lightColor]}>
            {data.name_of_store}
          </H2>
          <TextMedium style={[sGlobal.textCenter, sColor.lightColor]}>
            {data.name}
          </TextMedium>
        </View>
        <List style={s.listContainer}>
          <ListItem itemDivider style={sColor.lightBgColor}>
            <Text>Settings</Text>
          </ListItem>
          <ListArrow icon="contact" handlePress={() => push('Profile', data)}>
            Profile
          </ListArrow>
          <ListArrow icon="pin" handlePress={() => push('Address', data)}>
            Address
          </ListArrow>
          <ListArrow
            icon="key"
            handlePress={() => push('ChangePassword', data)}>
            Password
          </ListArrow>
          <ListArrow
            icon="ios-close-circle"
            last
            style={sColor.dangerColor}
            handlePress={() => setDeleteModal(true)}>
            Delete Account
          </ListArrow>

          <ListItem itemDivider style={sColor.lightBgColor}>
            <Text>Others</Text>
          </ListItem>
          <ListArrow icon="ios-help-circle">Help</ListArrow>
          <ListArrow icon="ios-information-circle" last>
            About
          </ListArrow>
          <ListArrow
            icon="log-out"
            last
            style={sColor.primaryColor}
            handlePress={signOut}>
            Logout
          </ListArrow>
        </List>
      </Content>
    </Container>
  );
}

const s = StyleSheet.create({
  modal: {
    paddingVertical: 24,
  },
  modalMessage: {
    paddingTop: 20,
    paddingBottom: 20 * 2,
  },
  modalButton: {
    borderRadius: 0,
  },
  banner: {
    paddingVertical: 32,
  },
  imgContainer: {
    marginBottom: 20,
  },
  imgView: {position: 'relative', width: 75, height: 75},
  imgCircle: {borderRadius: 75 / 2},
  img: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  border: {
    borderColor: color.light,
    borderWidth: 2.5,
  },
  listContainer: {
    paddingVertical: 15,
  },
  list: {
    borderBottomWidth: 0.5,
    borderColor: color.paleGray,
  },
  py: {
    paddingVertical: 5,
  },
});

const ListArrow = ({children, icon, style, last, handlePress}) => {
  return (
    <View style={[s.py, !last && s.list]}>
      <ListItem icon noBorder onPress={handlePress}>
        <Left>
          <Icon name={icon} style={style} />
        </Left>
        <Body>
          <Text style={style}>{children}</Text>
        </Body>
        {icon !== 'log-out' && (
          <Right>
            <Icon name="ios-arrow-forward" />
          </Right>
        )}
      </ListItem>
    </View>
  );
};

// profile - delete (method)

Profile.navigationOptions = {
  title: 'Account',
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
  },
};
