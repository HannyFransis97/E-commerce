import React, { useState, useEffect  } from "react";
import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline
} from "@material-ui/core";
import { Link , useHistory } from "react-router-dom";

const steps = ["Shipping Adderss", "Payment details"];

const Checkout = ({ cart , onCaptureCheckout , order,error }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false)

  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: 'cart',
        });
        setCheckoutToken(token);
        console.log(checkoutToken)

      } catch (error) {
        if (activeStep !== steps.length) history.push('/');
      }
    };
    generateToken();
  }, [cart]);

  const nextStep = () => setActiveStep((pervActiveStep) => pervActiveStep + 1);
  const backStep = () => setActiveStep((pervActiveStep) => pervActiveStep - 1);

  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  const timeout =()=>{
    setTimeout(() => {
      setIsFinished(true);
    }, 3000);
  }




  let Confirmation = () => (order.customer ? (
    <>
      <div>
        <Typography variant="h5">Thank you for your purchase.{order.customer.firstname} {order.customer.lastname} lastname</Typography>
        <Divider className={classes.divider}/>
        <Typography variant="subtitle2">Order ref:{order.customer_reference}</Typography>
        <br/>
        <Button component={Link} to="/" variant="outlined" type="button"> Back to Home</Button>
      </div>
    </>
  ): isFinished ? (
    <>
    <div>
      <Typography variant="h5">Thank you for your purchase.</Typography>
      <Divider className={classes.divider}/>
      <br/>
      <Button component={Link} to="/" variant="outlined" type="button"> Back to Home</Button>
    </div>
  </>

  ) : (
    <div className={classes.spinner}>
      <CircularProgress/>
    </div>
  ));
   
  if(error){
    <>
    <Typography variant="h5">Error:{error}</Typography>
    <br/>
    <Button component={Link} to="/" variant="outlined" type="button"> Back to Home</Button>

    </>
  }

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeout={timeout}/>
    );

  return (
    <>
    <CssBaseline/>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center"></Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
