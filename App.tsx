/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {BarChart} from 'react-native-gifted-charts';
import LinearGradient from 'react-native-linear-gradient';

const constants = require('./app_constants');

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const app = require('firebase/app');
const fire = require('firebase/firestore');

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const types = {
    Admin: 0,
    General: 1,
    Game: 2,
    Image: 3,
    Owner: 4,
  };

  const [typeNames, setTypeNames] = React.useState([
    'Admin',
    'General',
    'Image',
    'Game',
    'Owner',
  ]);

  const colors = {
    backgroundGradient0: '#222222',
    backGroundGradient1: 'blue',
    frontColor: '#29C5F6',
    sideColor: '#29C5F6',
    topColor: '#29C5F6',
    black: '#000000',
    white: '#FFFFFF',
  };

  const [barData, setBarData] = React.useState<
    Array<{value: number; label: string}>
  >([
    {value: 0, label: typeNames[types.Admin]},
    {value: 0, label: typeNames[types.General]},
    {value: 0, label: typeNames[types.Game]},
    {value: 0, label: typeNames[types.Image]},
    {value: 0, label: typeNames[types.Owner]},
  ]);

  const isDarkMode = useColorScheme() === 'dark';

  const firebaseConfig = constants.firebaseConfig;

  // Initialize Firebase
  const firebaseApp = app.initializeApp(firebaseConfig);
  const firedb = fire.getFirestore(firebaseApp);

  React.useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    let dataArray = [
      {value: 0, label: barData[types.Admin].label},
      {value: 0, label: barData[types.General].label},
      {value: 0, label: barData[types.Game].label},
      {value: 0, label: barData[types.Image].label},
      {value: 0, label: barData[types.Owner].label},
    ];

    const commandCollection = await fire.collection(firedb, 'commands');
    const commandSnapshot = await fire.getDocs(commandCollection);
    const commandList = commandSnapshot.docs.map(doc => {
      // console.log("Type: " + doc.data().type)
      // console.log("Index: " + doc.data().index)
      switch (doc.data().type) {
        case 'admin':
          dataArray[types.Admin].value += doc.data().index;
          break;
        case 'general':
          dataArray[types.General].value += doc.data().index;
          break;
        case 'game':
          dataArray[types.Game].value += doc.data().index;
          break;
        case 'image':
          dataArray[types.Image].value += doc.data().index;
          break;
        case 'owner':
          dataArray[types.Owner].value += doc.data().index;
          break;
      }
    });
    setBarData(dataArray);
    console.log(dataArray);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        colors={['#222222', 'blue']}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 2.2, y: 2.2}}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            <Section title={constants.appName}></Section>
          </View>
          <BarChart
            data={barData}
            barWidth={50}
            cappedBars
            capColor={'rgba(0, 0, 0, 0)'}
            capThickness={4}
            showGradient
            gradientColor={'rgba(65, 150, 240, 0.83)'}
            frontColor={'rgba(219, 182, 249,0.2)'}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
