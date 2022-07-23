import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Spinner} from 'native-base';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';

import ThemeContext from '../../context/ThemeContext';


const chartConfig = {
  backgroundColor: "#333",
  backgroundGradientFrom: "#333",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "#333",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: true, // optional
  decimalPlaces: 0,
  labelColor: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
let width = null;

const BudgetLineChart = (props) => {

  const {budgetRecords} = props;
  const [theme, _] = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({labels: [], datasets: [], legend: []});
  useEffect(() => {
    if (budgetRecords?.length == 0)
      return;

    setLoading(true);
    let labels = [];
    let dataset = {
        data: [],
        color: null,
        strokeWidth: 2
      }
      if (theme === 'dark')
        dataset.color = (opacity = 1) => `rgba(255, 255, 255, ${opacity})`;
      else
        dataset.color = (opacity = 1) => `rgba(10, 10, 10, ${opacity})`;
    const records = budgetRecords;
    let d1 = new moment(records[0].date).format('YYYY-MM-DD');
    const d2 = new moment(records[records.length-1].date).format('YYYY-MM-DD');

    let i=0;
    while (d1 <= d2){
      if (records[i].date < d1)
        dataset.data.push(records[i].amount)
      else
        dataset.data.push(records[i++].amount);
      labels.push(new moment(d1).format('MM-DD'));
      d1 = new moment(d1).add(1, 'days').format('YYYY-MM-DD');
    }
    width = records.length*80;
    if (width > 2000)
      width = 2000;
    if (theme === 'light'){
      chartConfig.labelColor = (opacity = 1) => `rgba(10, 10, 10, ${opacity})`;
      chartConfig.backgroundColor = 'white';
      chartConfig.backgroundGradientFrom = 'white';
      chartConfig.backgroundGradientTo = 'white';
    }else{
      chartConfig.labelColor = (opacity = 1) => `rgba(150, 150, 150, ${opacity})`;
      chartConfig.backgroundColor = '#333';
      chartConfig.backgroundGradientFrom = '#333';
      chartConfig.backgroundGradientTo = '#333';
    }
    setData({labels, datasets: [dataset]});
    setLoading(false);
  }, [budgetRecords]);

  if (loading)
    return (
      <View style={{width: screenWidth, height: screenHeight*0.45}}>
        {props.loading? props.loading:<></>}
      </View>
      )

	return (
      <LineChart
        data={data}
        width={width}
        height={screenHeight*0.45}
        verticalLabelRotation={30}
        chartConfig={chartConfig}
        yLabelsOffset={3}
        bezier
      />
		
		)
}

export default BudgetLineChart;