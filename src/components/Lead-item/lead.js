import React from "react";
import "./lead.css"
import Spinner from "../Spinner";
export default class Lead extends React.Component {

    dateTransform(unixDate) {
        let date = new Date(unixDate * 1000);
        let yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        let formattedToday = dd + '/' + mm + '/' + yyyy;
        return formattedToday;
    }

    isExpired(unixDate) {
        let result = unixDate * 1000 - Date.now()

        if (result > 86400000) { return "yellow" }
        if (result >= 0) { return "green" }
        if (result < 0) { return "red" }
    }

    render() {
        const { lead, isActive, activeTask } = this.props

        const { id, name, price} = lead


        if (isActive === false) {
            return (
                <li className='lead-item' onClick={() => this.props.setActive(id)}>
                    <div className="lead-subitems">
                        <div className="name lead-subitem">{name}</div>
                        <div className="price lead-subitem">{price}</div>
                        <div className="id lead-subitem">{id}</div>
                    </div>
                </li>
            )
        }
        if (isActive === true) {
            if (activeTask === null) {
                return (<Spinner />)
            }
            return (
                <li className='lead-item active'>
                    <div className="lead-subitems">
                        <div className="name lead-subitem">{name}</div>
                        <div className="price lead-subitem">{price}</div>
                        <div className="id lead-subitem">ID Задачи:{activeTask.id}</div>
                        <div className="created-time lead-subitem">Создано {this.dateTransform(activeTask.created_at)}</div>
                        <div className="status lead-subitem">
                            <div >Выполнить к {this.dateTransform(activeTask.complete_till)}</div>
                            <svg viewBox="0 0 12 12" version="1.1" style={{ width: '20px' }}
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="6" cy="6" r="5" fill={this.isExpired(activeTask.complete_till)} />
                            </svg>
                        </div>
                    </div>
                </li>
            )
        }

    }
}