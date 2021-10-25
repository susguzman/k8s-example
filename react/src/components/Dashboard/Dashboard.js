import AuthContext from '../../context/auth-context'
import { Container, Row, Col, Card, Form, Button, Spinner, ListGroup } from 'react-bootstrap';
import { useContext, useState, useEffect, useRef } from 'react';

const Dashboard = () => {
  const authCtx = useContext(AuthContext);
  const [userAccounts, setUserAccounts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const nombreCuentaRef = useRef();
  const tipoDeCuentaRef = useRef();
  const monedaRef = useRef();


  const updateAllUserAccounts = async () => {
    const idToken = await authCtx.currentUser.getIdToken();
    let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/account`, { 
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    });
    const accounts = await response.json();
    return accounts;
  }

  const createAccount = async (body) => {
    const idToken = await authCtx.currentUser.getIdToken();
    let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/account`, { 
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(body)
    });
    await response.json();
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(nombreCuentaRef.current.value === '') return;
    if(tipoDeCuentaRef.current.value === '') return;
    if(monedaRef.current.value === '') return;
    setDisableSubmit(true)
    const description = nombreCuentaRef.current.value;
    const account_type = parseInt(tipoDeCuentaRef.current.value, 10);
    const currency = parseInt(monedaRef.current.value, 10);
    try { 
      await createAccount({description, account_type, currency});
      const accounts = await updateAllUserAccounts();
      setUserAccounts(accounts.data);
    } catch(e) {
      console.log(e);
    }
    setDisableSubmit(false)
    nombreCuentaRef.current.value = '';
    tipoDeCuentaRef.current.value = '';
    monedaRef.current.value = '';
  }

  useEffect(() => {
    const getCurrenciesAnAccountTypes = async () => {
      const idToken = await authCtx.currentUser.getIdToken();
      let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/currency`, { 
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });
      let currencies = await response.json();
      response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/account-type`, { 
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });
      const accountTypes = await response.json();
      setCurrencies(currencies.data);
      setAccountTypes(accountTypes.data)
    }
    const getAllUserAccounts = async () => {
      const accounts = await updateAllUserAccounts();
      setUserAccounts(accounts.data);
    }
    getCurrenciesAnAccountTypes();
    getAllUserAccounts();
  }, [authCtx]);

  const accountTypesOptions = accountTypes.map((option) => <option value={option.account_type} key={option.account_type}>{option.description}</option>);
  const currenciesOptions = currencies.map((option) => <option value={option.currency} key={option.currency}>{option.description}</option>);
  const userAccountsList = userAccounts.map((account) => {
    return <ListGroup.Item key={account.account} action>
              <Card>
                <Card.Body>
                  <Card.Title>{account.description}</Card.Title>
                  <Card.Text>
                    <b>Tipo: </b> {account.account_description}, <b>Moneda: </b> {account.currency_description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </ListGroup.Item>;
  })


  return (
    <Container fluid className="mt-5">
      <Row className="align-items-center justify-content-center">
        <Col md={5} className="d-flex align-items-center justify-content-center">
            <Card style={{maxWidth: "80%"}}>
              <Card.Body>
                <Form onSubmit={onSubmitHandler}>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Nombre de cuenta</Form.Label>
                      <Form.Control placeholder="Ingrese nombre de cuenta" ref={nombreCuentaRef} />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridState">
                      <Form.Label>Tipo de cuenta</Form.Label>
                      <Form.Select ref={tipoDeCuentaRef} >
                        <option value=''>Seleccione una opción</option>
                        {accountTypesOptions}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState">
                      <Form.Label>Moneda de cuenta</Form.Label>
                      <Form.Select ref={monedaRef}>
                        <option value=''>Seleccione una opción</option>
                        {currenciesOptions}
                      </Form.Select>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3 justify-content-end">
                    <Col md={3} className="d-flex justify-content-end">
                      <Button
                        disabled={disableSubmit}
                        variant="outline-success" 
                        type="submit" 
                        style={{width: '100%'}}>
                          {disableSubmit && <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />}
                        Crear
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
        </Col>
        <Col md={3} className="d-flex align-items-start justify-content-center">
          <ListGroup>
            { userAccountsList }
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}
export default Dashboard;
