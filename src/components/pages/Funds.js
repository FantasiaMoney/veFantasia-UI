import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { inject, observer } from 'mobx-react'
import { Card, Badge, Form, Button, ButtonGroup } from 'react-bootstrap'
import Manage from '../modals/Manage'
import { ApiEndpoint } from '../../config'
import axios from 'axios'


async function getAllFunds(){
  let funds = []
  try{
    const data = await axios.get(ApiEndpoint + "/funds")
    funds = data.data.result
  }catch(e){
    alert("Cant connect to server")
  }
  return funds
}


function Funds(props) {
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    let isCancelled = false
     async function getFunds() {
         const funds = await getAllFunds()
         if(!isCancelled)
         setFunds(funds)
     }
     getFunds()
     return () => {
     isCancelled = true
   }
  }, [])

  return (
    <div>
     {
       funds.length > 0
       ?
       (
         <Form>
         <h3>
         <Badge variant="secondary"><small>Total funds: </small><Badge variant="light">{funds.length}</Badge></Badge>
         </h3>
         <br/>
         {
           funds.map((item, key) => (
             <React.Fragment key={key}>
             <Card className="text-center">
             <Card.Header>
             <strong>{item.name}</strong>
             </Card.Header>
             <ButtonGroup>
              <Button variant="outline-success" href={`#/fund/${item.id}`}>View</Button>
              <Manage fundID={item.id}/>
            </ButtonGroup>
             <Card.Footer>
             Total investors: {JSON.parse(item.deposits).length}
             </Card.Footer>
             </Card>
             <br/>
             </React.Fragment>
           ))
         }
         </Form>
       )
       :
       (
         <Form>
         <CircularProgress />
         </Form>
       )
     }
    </div>
  );
}

export default inject('MobXStorage')(observer(Funds))
