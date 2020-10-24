import UserList from "../components/UserList";
import MockData from "../data/mock.json";

export default function Dashboard() {

    return (
        <div className={"dashboard-container"}>
            <UserList users={MockData.users}></UserList>
        </div>
    )
}