import * as React from 'react';
import {FlatList, Linking, Platform} from 'react-native';
import styled from 'styled-components/native';
import {HEIGHT_WINDOW, WIDHTH_WINDOW} from '../../constants/Dimensions';
import {BLACK, WHITE, BLUE_GRAY} from '../../constants/COLOR';
import {normalize} from '../../constants/Dimensions';
import Contacts from 'react-native-contacts';
import {
  checkPermision,
  requestPermission,
  showAlert,
  TypePermission,
} from '../../ultities/Ultities';

const ContainerItem = styled.TouchableOpacity`
  padding-vertical: ${HEIGHT_WINDOW / 100}px;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  border-bottom-width: 1px;
  border-color: ${BLUE_GRAY};
`;

const NameText = styled.Text`
  font-size: ${normalize(14)}px;
  font-weight: 700;
  color: ${BLACK};
`;

const PhoneText = styled.Text`
  font-size: ${normalize(12)}px;
  font-weight: 400;
  color: ${BLACK};
  margin-top: ${HEIGHT_WINDOW / 100}px;
`;

export default function PhoneBookScreen() {
  const [data, setData] = React.useState([]);

  const getData = async () => {
    try {
      const permission = await checkPermision(
        TypePermission.contact[Platform.OS],
      );
      if (permission) {
        const response = await Contacts.getAll();
        const newData = response.map(item => {
          return {
            name: item.displayName,
            phoneNumber: item.phoneNumbers[0].number,
          };
        });
        const lastData = newData.sort((a, b) => a.name.localeCompare(b.name));
        setData(lastData);
      } else {
        const res = await requestPermission(
          TypePermission.contact[Platform.OS],
        );
        if (res) {
          const response = await Contacts.getAll();
          const newData = response.map(item => {
            return {
              name: item.displayName,
              phoneNumber: item.phoneNumbers[0].number,
            };
          });
          const lastData = newData.sort((a, b) => a.name.localeCompare(b.name));
          setData(lastData);
        }
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  };

  const onCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const renderItem = ({item}) => {
    return (
      <ContainerItem onPress={() => onCall(item.phoneNumber)}>
        <NameText>{item.name}</NameText>
        <PhoneText>{item.phoneNumber}</PhoneText>
      </ContainerItem>
    );
  };
  return (
    <FlatList
      contentContainerStyle={{flexGrow: 1, backgroundColor: WHITE}}
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
    />
  );
}
