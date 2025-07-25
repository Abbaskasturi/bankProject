// App.jsx
import { Link,Outlet  } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Bank Lending System</h1>
      <nav>
        <Link to="/create-loan"><button>Create Loan</button></Link>
        <Link to="/pay-emi"><button>Pay EMI</button></Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default App;
