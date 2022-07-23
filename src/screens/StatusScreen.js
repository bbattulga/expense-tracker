import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet, 
        Dimensions, 
        ScrollView,
        RefreshControl} from 'react-native';
import {View,
    Content,
    Spinner,
    Card,
    CardItem,
		Text} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import {PieChart, LineChart} from 'react-native-chart-kit';
import moment from 'moment';

import Screen from '../components/screen/Screen';
import ExpensePieChart from '../components/chart/ExpensePieChart';
import ExpenseLineChart from '../components/chart/ExpenseLineChart';
import DateRangePicker from '../components/date/DateRangePicker';
import * as Query from '../database/query';
import {localized} from '../localization/Localize';
import ThemeContext from '../context/ThemeContext';


const screenWidth = Dimensions.get('window').width;

const date1 = new moment().subtract(7, 'days').toDate();
const date2 = new Date();
let dateRange = [date1, date2];

const dateFormat = (d) => {
  return new moment(d).format('YYYY-MM-DD');
}
const StatusScreen = (props) => {

  const [income, setIncome] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [theme, _] = useContext(ThemeContext);

  const handleDateSelect = (d1, d2) => {
    dateRange[0] = d1;
    dateRange[1] = d2;
    fetch(d1, d2);
  }

  const fetch = (d1, d2) => {
    setLoading(true);
    const fdate1 = new moment(d1).format('YYYY-MM-DD 00:00:00');
    const fdate2 = new moment(d2).format('YYYY-MM-DD 23:59:59');
    (async () => {
      const data = await Query.fetchTransactions(fdate1, fdate2);
      let income = 0;
      let outcome = 0;
      for (let i=0; i<data.length; i++){
        if (data[i].amount > 0)
          income += (data[i].amount);
        else
          outcome += Math.abs((data[i].amount));
      }
      setIncome(income);
      setOutcome(outcome);
      const types = await Query.fetchTransactionCategories();
      for (let i=0; i<types.length; i++){
        types[i].color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      }
      setTransactions(data.filter(d => d.amount < 0));
      setTypes(types);
      setLoading(false);
    })();
  }

  useFocusEffect(
    useCallback(() => {
      fetch(dateRange[0], dateRange[1]);
    }, [])
  );

  const renderContent = () => {
    if (loading)
      return <></>
    if (transactions.length == 0)
      return (
        <View style={{alignItems: 'center'}}>
          <Text>no expenses</Text>
        </View>
        )
    return (
      <>
      <ExpensePieChart transactions={transactions}
                             types={types}/>
        <View>
          <ExpenseLineChart transactions={transactions}
                     types={types} />
        </View>
      </>
      )
  }

	return (
		<Screen>
      <Content refreshControl={<RefreshControl refreshing={loading} onRefresh={fetch}/>}>
        <View style={styles.container}>
          <Card>
            <CardItem>
              <DateRangePicker onSelect={handleDateSelect}
                            date1={dateRange[0]} date2={dateRange[1]}
                            formatChosenDate={dateFormat} />
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <View>
                 <Text>{localized('expense')} {outcome}</Text>
                <Text>{localized('income')} {income}</Text>
              </View>
            </CardItem>
            <CardItem>
              <View style={{flex: 1}}>
                {renderContent()}
              </View>
            </CardItem>
          </Card>
            
        </View>
      </Content>
		</Screen>
		)
}

const styles = StyleSheet.create({
  dateRangeContainer: {
    margin: 15
  },
  container: {
    flex: 1
  }
})

export default StatusScreen;