import { Button, TextInputField, Pane, TagInput, Label, FormField } from 'evergreen-ui'
import { ClientForm } from 'src/types'
import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'

const schema = yup.object({
  companyName: yup.string().required(),
  iin: yup.string().required(),
  offers: yup.number(),
  ltv: yup.number(),
  email: yup.string().email().notRequired(),
  phone: yup.string().required(),
  address: yup.string().notRequired(),
  contacts: yup.array(yup.string()).notRequired(),
  tags: yup.array(yup.string()).notRequired()
})

interface Props {
  initialValues?: Partial<ClientForm>
  onSubmit: (cl: ClientForm) => Promise<void>
}
const defaultValues: ClientForm = {
  companyName: '',
  iin: '',
  ltv: 0,
  email: '',
  address: '',
  contacts: [],
  offers: 0,
  phone: '',
  tags: []
}
export default function Component ({ initialValues, onSubmit }: Props) {
  const formik = useFormik<ClientForm>({
    initialValues: {
      ...defaultValues,
      ...initialValues
    },
    validationSchema: schema,
    onSubmit
  })

  const handleTagChange: any = async (values) => {
    await formik.setFieldValue('tags', values)
  }

  return (
    <Pane padding={100}>
      <TextInputField
        isInvalid={formik.touched.companyName && !!formik.errors.companyName}
        required
        value={formik.values.companyName}
        onChange={formik.handleChange}
        name='companyName'
        label='Название'
        validationMessage={
          formik.touched.companyName && formik.errors.companyName
        }
      />
      <TextInputField
        isInvalid={formik.touched.iin && !!formik.errors.iin}
        required
        value={formik.values.iin}
        onChange={formik.handleChange}
        name='iin'
        label='ИИН / БИН'
        validationMessage={formik.touched.iin && !!formik.errors.iin}
      />
      <TextInputField
        isInvalid={formik.touched.phone && !!formik.errors.phone}
        required
        value={formik.values.phone}
        onChange={formik.handleChange}
        name='phone'
        label='Телефон'
        validationMessage={formik.touched.phone && formik.errors.phone}
      />
      <TextInputField
        isInvalid={formik.touched.email && !!formik.errors.email}
        value={formik.values.email}
        onChange={formik.handleChange}
        name='email'
        label='Email'
        validationMessage={formik.touched.email && formik.errors.email}
      />
      <TextInputField
        isInvalid={formik.touched.address && !!formik.errors.address}
        value={formik.values.address}
        onChange={formik.handleChange}
        name='address'
        label='Адрес'
        validationMessage={formik.touched.address && formik.errors.address}
      />
      {/* <Label>Метки</Label> */}
      <FormField label='Метки' marginBottom={24}>
        <TagInput
          inputProps={{ placeholder: 'Метки...' }}
          values={formik.values.tags}
          onChange={handleTagChange}
          width='100%'
        />
      </FormField>
      <TextInputField
        isInvalid={formik.touched.ltv && !!formik.errors.ltv}
        value={formik.values.ltv}
        onChange={formik.handleChange}
        name='ltv'
        label='LTV'
        description='Новые КП будет прибавлятся к LTV'
        validationMessage={formik.touched.address && formik.errors.ltv}
      />
      <Button
        disabled={formik.isSubmitting || !formik.isValid}
        onClick={() => formik.handleSubmit()}
        appearance='primary'
        type='submit'
      >
        Submit
      </Button>
    </Pane>
  )
}
