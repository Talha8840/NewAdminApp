import React, {useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker from './CustomMarker';
import Item from './Item';

export default function CustomSlider({min, max, setSliderValue, sliderValue}) {
  const [first, setFirst] = useState(min);

  const sliderValuesChange = (values) => {
    setSliderValue(values[0]);
  };

  const renderScale = () => {
    const performance = ["Didn't", 'Bad', 'Okay', 'Good', 'Great', 'Genius'];
    const items = [];
    for (let i = min; i <= max; i++) {
      items.push(
        <Item
          key={performance[i - 1]}
          value={performance[i - 1]}
          first={first}
          sliderValue={sliderValue}
        />,
      );
    }
    return items;
  };

  return (
    <View>
      <View style={styles.container}>
        <MultiSlider
          trackStyle={{backgroundColor: '#181818', height: 5}}
          selectedStyle={{backgroundColor: '#0fb6cd'}}
          values={[min]}
          sliderLength={Dimensions.get('window').width - 80}
          onValuesChange={sliderValuesChange}
          min={min}
          max={max}
          step={1}
          allowOverlap={false}
          customMarker={CustomMarker}
          snapped={true}
        />
      </View>
      <View style={styles.column}>{renderScale()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: -20,
  },
  active: {
    textAlign: 'center',
    fontSize: 20,
    color: '#5e5e5e',
  },
  inactive: {
    textAlign: 'center',
    fontWeight: 'normal',
    color: '#bdc3c7',
  },
  line: {
    textAlign: 'center',
  },
});
