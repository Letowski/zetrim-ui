import {
    Navigate,
    useLocation,
} from "react-router-dom";
import {getFromStore} from "../utils/StorageUtils";

export default function RootRouter() {
    let location = useLocation();
    if ((getFromStore('isKeySet') ?? '') === 'true') {
        return <Navigate to="/chat" state={{ from: location }} replace />;
    } else {
        return <Navigate to="/keys" state={{ from: location }} replace />;
    }
}
