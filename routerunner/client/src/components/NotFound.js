import { Link } from "react-router-dom";

const NotFound = () => {
    return ( <div className="not-found">
        <h2>Sorry</h2>
        <p>That Page Cannot Be Found</p>
        <Link to="/">Back To The Home Page...</Link>
    </div>
    );
}
 
export default NotFound;