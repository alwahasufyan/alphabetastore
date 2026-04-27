"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

// GLOBAL CUSTOM COMPONENTS
import { FormProvider } from "components/form-hook";

// LOCAL CUSTOM COMPONENTS
import Card from "./card";
import Heading from "./heading";
import DeliveryDate from "./delivery-date";
import DeliveryAddresses from "./delivery-addresses";
import Voucher from "./payments/voucher";
import CardList from "./payments/card-list";
import PaymentForm from "./payments/payment-form";

// TYPES

const validationSchema = yup.object().shape({
  card: yup.string().optional(),
  voucher: yup.string().optional(),
  saveCard: yup.boolean().optional(),
  date: yup.string().required("Delivery date is required"),
  time: yup.string().required("Delivery time is required"),
  address: yup.string().required("Delivery address is required"),
  cardHolderName: yup.string().when("card", {
    is: val => !val,
    then: Schema => Schema.required("Name is required")
  }),
  cardNo: yup.string().when("card", {
    is: val => !val,
    then: Schema => Schema.required("Card No is required")
  }),
  cardExpiry: yup.string().when("card", {
    is: val => !val,
    then: Schema => Schema.required("Expiry is required")
  }),
  cardCVC: yup.string().when("card", {
    is: val => !val,
    then: Schema => Schema.required("CVC is required")
  })
});


// ==============================================================


// ==============================================================

export default function CheckoutForm({
  cards,
  deliveryAddresses,
  deliveryTimes
}) {
  const [submitBlocked, setSubmitBlocked] = useState(false);
  const initialValues = {
    card: "",
    date: "",
    time: "",
    address: "",
    voucher: "",
    cardNo: "",
    cardCVC: "",
    cardExpiry: "",
    cardHolderName: "",
    saveCard: false
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    control,
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = methods;
  const isSelectedCard = useWatch({
    control,
    name: "card"
  });
  const handleSubmitForm = handleSubmit(values => {
    setSubmitBlocked(true);
  });
  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <DeliveryDate deliveryTimes={deliveryTimes} />

      <DeliveryAddresses deliveryAddresses={deliveryAddresses} />

      <Card>
        <Heading number={3} title="Payment Details" />

        {!isSelectedCard && <PaymentForm />}

        <CardList cards={cards} />

        <Voucher />

        {submitBlocked ? <Alert severity="info" sx={{ mb: 3 }}>
            إتمام الطلب من مسار الدفع البديل غير مدعوم حاليًا لأنه لم يتم ربطه بواجهة إنشاء الطلبات الفعلية.
          </Alert> : null}

        <Button size="large" type="submit" color="primary" variant="contained" loading={isSubmitting}>
          Place Order
        </Button>
      </Card>
    </FormProvider>;
}