import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Spinner} from 'native-base';
import {LineChart} from 'react-native-chart-kit';
import ThemeContext from '../../context/ThemeContext';
import moment from 'moment';


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

// const data = {
//   labels: ["January", "February", "March", "April", "May", "June"],
//   datasets: [
//     {
//       data: [20, 45, 28, 80, 99, 43],
//       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
//       strokeWidth: 2 // optional
//     }
//   ],
//   legend: ["Rainy Days"] // optional
// };

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const screenWidth = Dimensions.get('window').width;

let width = null;
const ExpenseLineChart = (props) => {

  const {transactions, types, height} = props;
  const [theme, _] = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({labels: null, datasets: null, legend: []});

  useEffect( () => {
    setLoading(true);
    
    if (transactions.length == 0)
      return () => console.log('no transactions');

    const date1 = new moment(transactions[0].created_at).format('YYYY-MM-DD');
    const date2 = new moment(transactions[transactions.length-1].created_at).format('YYYY-MM-DD');
    const dateDelta = new moment(date2).diff(new moment(date1), 'days');

    let labels = [];
    let datasets = [];
    let legend = [];
    // not optimized
    let d1 = date1;
    while (d1 <= date2){
      labels.push(new moment(d1).format('MM-DD'));
      d1 = new moment(d1).add(1, 'days').format('YYYY-MM-DD');
    }
    for (let i=0; i<types.length; i++){

      const type = types[i];
      legend.push(type.name);
      let rgb = hexToRgb(type.color);
      let dataset = {
        data: [],
        color: (opacity = 1) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
        strokeWidth: 2
      }
      const txs = transactions.filter(t => t.category_id === type.id);
      let d1 = date1;
      while (d1 <= date2){

        let txTotal = 0;
        for (let i=0; i<txs.length; i++){
          let tx = txs[i];
          let txDate = new moment(tx.created_at).format('YYYY-MM-DD');
          if (txDate === d1){
            txTotal += Math.abs(parseInt(tx.amount));
          }
          else if (txDate > d1)
            break;
        }
        dataset.data.push(txTotal);
        d1 = new moment(d1).add(1, 'days').format('YYYY-MM-DD');
      }
      datasets.push(dataset);
    }
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
    setData({labels, datasets});
    width = dateDelta*80;
    if (width > 2000)
      width = 2000;
    setLoading(false);
  }, [transactions]);


  
  if (loading)
    return (
      <View>
        <Spinner />
      </View>
      )

	return (
    <ScrollView horizontal>
      <View style={{paddingBottom: 30, backgroundColor: theme==='light'? 'white':'#333'}}>
        <LineChart
          data={data}
          width={width}
          height={height}
          verticalLabelRotation={30}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    </ScrollView>
    
		)
}
ExpenseLineChart.defaultProps = {
	width: screenWidth,
	height: 220
}

export default ExpenseLineChart;