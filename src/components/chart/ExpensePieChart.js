import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Spinner} from 'native-base';
import {PieChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-community/async-storage';

import ThemeContext from '../../context/ThemeContext';

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

// const data = [
//   {
//     name: "Seoul",
//     population: 21500000,
//     color: "rgba(131, 167, 234, 1)",
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 15
//   },
//   {
//     name: "Toronto",
//     population: 2800000,
//     color: "#F00",
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 15
//   },
//   {
//     name: "Beijing",
//     population: 527612,
//     color: "red",
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 15
//   },
//   {
//     name: "New York",
//     population: 8538000,
//     color: "#ffffff",
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 15
//   },
//   {
//     name: "Moscow",
//     population: 11920000,
//     color: "rgb(0, 0, 255)",
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 15
//   }
// ];

const screenWidth = Dimensions.get('window').width;

const ExpensePieChart = (props) => {
  const {transactions, types} = props;
  const [theme, _] = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoading(true);
    let data = [];
    for (let i=0; i<transactions.length; i++){
      let tx = transactions[i];
      let type = types.find(t => t.id == tx.category_id);
      
      let d = data.find(f => f.name === type.name);
      if (!d){
        let color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        d = {
          name: type.name,
          total: 0,
          color: type.color? type.color:color,
          legendFontColor: type.color? type.color:color,
          legendFontSize: 15
        }
        data.push(d);
      }
      d.total += Math.abs(tx.amount);
    }
    setData(data);
    setLoading(false);
  }, [transactions, types]);

  if(loading)
    return <Spinner />
  
	return (
		<PieChart
                data={data}
                width={props.width}
                height={props.height}
                chartConfig={chartConfig}
                accessor="total"
                backgroundColor={theme === 'light'? 'white':'#333'}
                paddingLeft="0"
                absolute
              />
		)
}
ExpensePieChart.defaultProps = {
	width: screenWidth,
	height: 220
}

export default ExpensePieChart;