
import { json } from 'react-router-dom';
import './App.css';
import React from 'react';
import Spinner from '../spinner';
import Lead from '../Lead-item';


export default class App extends React.Component {

  state = {
    leads : [],
    activeLead: null,
    activeTask: null,
  }
  authorizationKey = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImU2ZDRhZDI1NDUyZmE3Yzk0NmE3YTc2YWQ1YjE0ODZlZWY5NjI0MDQ4ODFlYWI3NjhmZGM0Nzg1NDUwMDZmYWQ4NGYzMjZjNmRlN2RmNzRjIn0.eyJhdWQiOiJmYjg5NDJhNC04ZWUxLTRkYjYtOTY4Yy02YjE5Y2FkOTMxMmYiLCJqdGkiOiJlNmQ0YWQyNTQ1MmZhN2M5NDZhN2E3NmFkNWIxNDg2ZWVmOTYyNDA0ODgxZWFiNzY4ZmRjNDc4NTQ1MDA2ZmFkODRmMzI2YzZkZTdkZjc0YyIsImlhdCI6MTcyODQ3MzM4MiwibmJmIjoxNzI4NDczMzgyLCJleHAiOjE3NDY1NzYwMDAsInN1YiI6IjExNjE4MDkwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTk1MDEwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMTIxMjdiY2MtZTJhNy00ZDM3LThjNDEtZWFmNGYzZGRlN2FiIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.bQGRHdBMzzW_uJ1SuLD--nJG0DCMJwDkCpl_MFL25gQQv32RUsIYPOESsgsMso24qsw09lFRIrgWWIggT0AckH_BQ94ct52oBie_woceJrkqCcnbbRHYe6ZmzoLNS77EOADUY9y4SPZ8NWLN4vVOju0vnAJAbL2iTHyFsw9HkroK8_Ibm0aTS1JqWFcQLXH6CE7W9Coz8J5Ef9htVR9nJjoQzqi6bwCghp-qAS_krn-h0zTdvwTwYoS6lLMsLJcrmUZlY1-f_hQm3raCsyPtBO37Q06CYPF4P_XoIy2vupyPLt983g2DIErUMbyW3l5lWvILMb_EG2lqMWU9YDAkkQ'
  proxy = "https://germankovalenkophp.amocrm.ru" // <-------- PROXY ADRESS (example 'http://localhost:8010/proxy') Change if using proxy. My account adress "https://germankovalenkophp.amocrm.ru"

async componentDidMount() {
  for (let i = 1; true; i++) {
    let res = await this.getLeads(i)
    if (res === null) {break}
    async function waitSec(n) {
      return new Promise(resolve => setTimeout(resolve,n*1000))
    }
    await waitSec(1)
   }
}


async getLeads(page) {
  const searchParams = new URLSearchParams({
    page: page,
    limit: 3,
  });
  const res = await fetch(`${this.proxy}/api/v4/leads?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      'Authorization' : this.authorizationKey
    },
    });
  if (res.status === 204) {
      return null
  }
  if (!res.ok) {
    throw new Error(`Fetch error:` + res)
  }
  const body = await res.json();
   console.log(body)
  const newArr = [...this.state.leads]
      this.setState({leads: [...newArr,...body._embedded.leads]})
        return body._embedded.leads
}


async getTask(id) {
  this.setState({activeTask: null})
  const res = await fetch(`${this.proxy}/api/v4/tasks?filter[entity_id][]=${id}`,{
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      'Authorization' : this.authorizationKey
    }})
  if (!res.ok) {
      throw new Error(`Fetch error:` + res)
  }
  const body = await res.json();
  console.log(body)
  this.setState({activeTask: body._embedded.tasks[0]})
}

setActive = (id)=> {
  this.getTask(id)
  this.setState({activeLead: id});
}

renderLeads(arr) {
  return arr.map((item) => {
     return (
       <Lead  lead={item} isActive={(item.id === this.state.activeLead) ? true : false} setActive={((id) => this.setActive(id))} activeTask={this.state.activeTask}/>
     )
   })
}


render() {
  if (this.state.leads.length === 0 ) {
    return <Spinner />
  }
  return (
    <main>
      <div className='list-title'> <div className="list-title-subitem ">Сделки</div></div>
    <div className='list-title'>
    <div className="lead-subitems">
                        <div className="list-title-subitem ">Название задачи</div>
                        <div className="list-title-subitem ">Сумма</div>
                        <div className="list-title-subitem ">ID</div>
                    </div>
    </div>
    <ul className="lead-list">
      {this.renderLeads(this.state.leads)}
    </ul>
    </main>
  );
}
 }

  