var tasksJSON='[{"id":33,"title":"Задание 1","discription":"Полное описание задания 1","timeToDo":1,"timePlan":1,"status":"1","who":1,"date":"30.07.2018","prioritet":1},{"id":2,"title":"Задание 2","discription":"Полное описание задания 2","timeToDo":2,"timePlan":2,"status":"1","who":2,"date":"31.07.2018","prioritet":2},{"id":3,"title":"Задание 3","discription":"Полное описание задания 3","timeToDo":8,"timePlan":6,"status":"2","who":3,"date":"30.07.2018","prioritet":3},{"id":4,"title":"Задание 4","discription":"Полное описание задания 4","timeToDo":3,"timePlan":3,"status":"2","who":1,"date":"31.07.2018","prioritet":2},{"id":5,"title":"Задание 1","discription":"Полное описание задания 1","timeToDo":5,"timePlan":4,"status":"3","who":3,"date":"29.07.2018","prioritet":3},{"id":6,"title":"Задание 2","discription":"Полное описание задания 2","timeToDo":2,"timePlan":1,"status":"4","who":2,"date":"29.07.2018","prioritet":1},{"id":7,"title":"Задание 3","discription":"Полное описание задания 3","timeToDo":2,"timePlan":1,"status":"3","who":2,"date":"31.07.2018","prioritet":1},{"id":8,"title":"Задание 4","discription":"Полное описание задания 4","timeToDo":1,"timePlan":1,"status":"2","who":1,"date":"30.07.2018","prioritet":3}]';

var tasks=JSON.parse(tasksJSON);

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const Link = ReactRouterDOM.Link;

var userId=-1;
var auth=false;

class LoginApp extends React.Component{
    constructor(props){
        super(props);

        this.clickBtn=this.clickBtn.bind(this);
        this.onChangeHandler=this.onChangeHandler.bind(this);
        this.state={select: "1", login: "", password:""};
    }
    onChangeHandler(e){
        if (e.target.id=="log")
            this.state.login=e.target.value;
            else this.state.password=e.target.value;

    }
    clickBtn(e){
        for (let i=0; i<this.props.users.length; i++){

        if ((this.state.login==this.props.users[i].login) && (this.state.password==this.props.users[i].pass)){
            auth=true;
            userId=this.props.users[i].uid;
            this.props.history.push('/list');}
        }
    }

    render(){
        return(
            <div id="login">
                <h1>Авторизуйтесь</h1>
                <input type="text" id="log" onChange={this.onChangeHandler} />
                <input type="password" id="pass" onChange={this.onChangeHandler} />
                <button onClick={this.clickBtn}>Войти</button>
            </div>
        )
    }
}


var timer;
var tempArr;
var test=true;

class MainApp extends React.Component{
constructor(props){
    super(props);
    
    this.changeSelect=this.changeSelect.bind(this);
    this.sortId=this.sortId.bind(this);
    this.sortStatus=this.sortStatus.bind(this);
    this.sortPrioritet=this.sortPrioritet.bind(this);
    this.saveChanges=this.saveChanges.bind(this);
    this.showHiddenBtn=this.showHiddenBtn.bind(this);
    this.setState({idSorted: true, statusSorted: true, filtered: false, prioritetSorted: true, hiddenBtn: true});

    if (userId!==-1){
        users.map((user)=>{
        if (user.uid==userId){
            this.state={name: user.name, surename: user.surename, tasksArr: [], tasksUserArray: []}}
        });
    
        this.props.tasks.map((task)=>{
            if (task.who==userId) {
                this.state.tasksArr.push(task);
                this.state.tasksUserArray.push(task);
            }
        });
    } else {
        this.props.history.push('/');
        ReactDOM.unmountComponentAtNode(document.getElementById("app"));
        return null;
    }
}

changeSelect(e){
    let select=+e.target.value;
    let filtArray=[];
//    this.setState({hiddenBtn: false});
test=false;
    if (select!==0){
        this.state.tasksUserArray.map((task)=>{
            if (task.status==select) {
                filtArray.push(task);
                }
            });
        this.setState({tasksArr: filtArray});
    } else {
        this.setState({tasksArr: this.state.tasksUserArray});
    }
}    

sortId(){
    tempArr=this.state.tasksArr.slice().sort((a, b)=>{
        if (this.state.idSorted==true)
            return a['id']-b['id']
        else return b['id']-a['id'];
    });
    this.state.idSorted=!this.state.idSorted;
    this.setState({tasksArr: tempArr});
}
sortStatus(){
    tempArr=this.state.tasksArr.slice().sort((a, b)=>{
        if (this.state.statusSorted==true)
            return a['status']-b['status']
            else return b['status']-a['status'];
    });
    this.state.statusSorted=!this.state.statusSorted;
    this.setState({tasksArr: tempArr})
}
sortPrioritet(){
    tempArr=this.state.tasksArr.slice().sort((a, b)=>{
        if (this.state.prioritetSorted==true)
            return a['prioritet']-b['prioritet']
            else return b['prioritet']-a['prioritet'];
    });
    this.state.prioritetSorted=!this.state.prioritetSorted;
    this.setState({tasksArr: tempArr})
}

saveChanges(){
    let detailId=+document.getElementById("detailId").innerText;
    let tempTask={};
    let selectStatus=+document.getElementById("selectStatus").value;
    this.state.tasksArr.map((task)=>{
        if (task.id==detailId) {
            tempTask=task;
            tempTask.status=selectStatus;
            this.setState({task: tempTask});}
    });
}
showHiddenBtn(){
    this.setState({hiddenBtn: false});
}

componentWillMount() {
    this.setState({hiddenBtn: true});
    if (!auth){
        this.props.history.push('/');
    }

    if (timer==undefined){
        timer=setInterval(()=>{
        ReactDOM.unmountComponentAtNode(document.getElementById("app"));
        ReactDOM.render(
            <MainApp tasks={tasks} />,
            document.getElementById("app")
        )
    }, TIMER_INTERVAL_MINUTES*60000);
}   
}

    render(){
        return (
            <div id="main">
               <h1>Здравствуйте, {this.state.surename} {this.state.name}!</h1>
                <table id="table">
                    <caption>Список задач</caption>
                    <thead>
                    <tr data-status=''>
                        <th onClick={this.sortId}>ID</th>
                        <th>Задание</th>
                        <th>Дата</th>
                        <th onClick={this.sortStatus}>Статус</th>
                        <th onClick={this.sortPrioritet}>Приоритет</th>
                    </tr> 
                    </thead>                       
                        {
                            this.state.tasksArr.map((task)=>{return <MainTr data={task} showHiddenBtn={this.showHiddenBtn} />})
                        }
                </table>
                <p>Показать задачи со статусом: 
                <select onChange={this.changeSelect}>
                    <option key="0" value="0">Все</option>
                    <option key="1" value="1">Открытые</option>
                    <option key="2" value="2">В работе</option>
                    <option key="3" value="3">Отложенные</option>
                    <option key="4" value="4">Закрытые</option>
                </select>
                </p>
                <div id="details"></div>
                <button onClick={this.saveChanges} className={this.state.hiddenBtn ? "hiddenBtn" : ""}>Сохранить изменения</button>
            </div>
        ) 
   
    }
}

class MainTr extends React.Component {
constructor(props){
    super(props);
    this.onClickTr=this.onClickTr.bind(this);
}

onClickTr(e) {
    ReactDOM.render(
        <Details id={e.target.parentNode.id} showHiddenBtn={this.props.showHiddenBtn} />,
        document.getElementById("details")
    )
}
    render() {
      return (<tr data-status={this.props.data.status} onClick={this.onClickTr} id={this.props.data.id} >
                <td>{this.props.data.id}</td>
                <td>{this.props.data.title}</td>
                <td>{this.props.data.date}</td>
                <td>{this.props.data.status}</td>
                <td>{this.props.data.prioritet}</td>
            </tr>)
    }
  }

var currentTask;

class Details extends React.Component {
constructor(props){
    super(props);
    this.setSelectStatus=this.setSelectStatus.bind(this);
    this.setSelectPrioritet=this.setSelectPrioritet.bind(this);
}

setSelectStatus(id){
    if (currentTask.status==id) return true;
}

setSelectPrioritet(id){
    switch(id){
        case 1:
        return "Низкий";
        break;
        case 2:
        return "Обычный";
        break;
        case 3:
        return "Высокий";
        break;
    }
}

    render(){
        return(
            <div>
            <h1> Подробности</h1>
            {
                tasks.map((task)=>{
                if (task.id==this.props.id) {
                    currentTask=task;
                }
            })
           
            }
            <p>ID задания: <span id="detailId">{currentTask.id}</span> </p>
            <p>Название: {currentTask.title}</p>
            <p>Подробное описание: {currentTask.discription}</p>
            <p>Время выполнения: {currentTask.timeToDo}</p>
            <p>Запланированное время : {currentTask.timePlan}</p>
            <p>Дата: {currentTask.date}</p>
            <p>Статус: </p>
                <select id="selectStatus" onChange={this.props.showHiddenBtn} >
                    <option key="1" value="1" selected={this.setSelectStatus("1")}>Открытая</option>
                    <option key="2" value="2" selected={this.setSelectStatus("2")}>В работе</option>
                    <option key="3" value="3" selected={this.setSelectStatus("3")}>Отложенная</option>
                    <option key="4" value="4" selected={this.setSelectStatus("4")}>Закрытая</option>
                </select>
            <p>Приоритет: {this.setSelectPrioritet(currentTask.prioritet)}</p>
            </div>
        )
    }
}


class NotFound extends React.Component {
    render(){
        return(
            <h1>Страница не найдена</h1>
        )
    }
}

ReactDOM.render(
    <Router>
        <div>
            <Switch>
                <Route exact path="/" render={(props)=><LoginApp users={users} {...props}/>} />
                <Route exact path="/list" render={(props)=><MainApp tasks={tasks} {...props}/>} />
                <Route component={NotFound} />
            </Switch>
        </div>
    </Router>,
    document.getElementById("app")
)
