import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { ApiEndpoint, CURRENCY } from '../../config'
import { Form, Card } from 'react-bootstrap'
import InvestorsPie from '../charts/InvestorsPie'
import axios from 'axios'


async function getFundData(fundID){
  let fund = []
  let chart = null
  let valueInETH = 0

  try{
    const data = await axios.get(ApiEndpoint + "/fund/" + fundID)
    fund = data.data.result
    const deposit = JSON.parse(fund.deposits)

    if(deposit.length > 0){
      chart = {
        "labels": deposit.map(i => i.investorID),
        "data": deposit.map(i => i.investorShare)
      }
    }
  }
  catch(e){
    console.log("err", e)
    alert("Cant connect to server")
  }

  try{
    const data = await axios.get(ApiEndpoint + "/fund-value-in-eth/" + fundID)
    valueInETH = data.data.result
  }
  catch(e){
    console.log("err", e)
    alert("Cant connect to server")
  }
  return { fund, chart, valueInETH }
}

function FundPage(props) {
  const [fundData, setFundData] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [valueInETH, setValueInETH] = useState(0)

  useEffect(() => {
    let isCancelled = false
     async function getFund() {
         const { fund, chart, valueInETH } = await getFundData(props.match.params.id)
         if(!isCancelled){
           setFundData(fund)
           setChartData(chart)
           setValueInETH(valueInETH)
         }
     }
     getFund()
     return () => {
     isCancelled = true
   }
  }, [props.match.params.id])

  return(
    <Form>
    {
      fundData
      ?
      (
        <>
        <Card className="text-center">
        <Card.Header>
        <strong>Fund name: {fundData.name}</strong>
        </Card.Header>
        </Card>
        <br/>
        <Card className="text-center">
        <Card.Header>
        <strong>Investors shares</strong>
        {
          chartData
          ?
          (
            <InvestorsPie chart={chartData} />
          )
          : null
        }
        </Card.Header>
        </Card>
        <br/>
        <Card className="text-center">
        <Card.Header>
        <strong>Fund value in {CURRENCY}: {Number(valueInETH).toFixed(4)}</strong>
        </Card.Header>
        </Card>
        <br/>
        <Card className="text-center">
        <Card.Header>
        <small><strong>Fund id: {fundData.id}</strong></small>
        </Card.Header>
        </Card>
        </>
      )
      :
      (
        <CircularProgress />
      )
    }
    </Form>
  )
}

export default FundPage
