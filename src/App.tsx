import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";

const App = () => {
    const {store} = useContext(Context);

    const [users, setUsers] = useState<IUser[]>([]);

    const getUsers = async() => {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    if (store.isLoading) {
        return <h1>Loading...</h1>
    }

    if (!store.isAuth) {
        return <><LoginForm/>
            <div>
                <button onClick={getUsers}>Get users</button>
            </div>
        </>
    }


    return (
        <div>
            <h1>{store.isAuth ? `Authorized user: ${store.user.email}`: 'Please login'}</h1>
            <h1>{store.user.isActivated ? 'Account was activated' : 'Activate your account'}</h1>
            <button onClick={() => store.logout()}>Logout</button>
            <div>
                <button onClick={getUsers}>Get users</button>
            </div>
            {users.map(user => <div key={user.email}>{user.email}</div>)}
        </div>
    );
};

export default observer(App);
