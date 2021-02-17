import { Button, TextInputField, Pane, TagInput, FormField, Select } from 'evergreen-ui'
import { ProductForm, Unit } from 'src/types'
import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required(),
  price: yup.number().required(),
  unit: yup.number().required(),
  createdById: yup.string().required(),
  createdAt: yup.date().required(),
  url: yup.string().notRequired(),
  description: yup.string().notRequired(),
  photoURL: yup.string().notRequired(),
  updatedAt: yup.date().notRequired()
})

interface Props {
  initialValues?: Partial<ProductForm>
  onSubmit: (cl: ProductForm) => Promise<void>
}
const defaultValues: ProductForm = {
  name: '',
  price: 0,
  unit: Unit.pcs,
  description: '',
  photoURL: '',
  url: '',
  ltv: 0,
  offers: 0,
  tags: []
}
export default function Component ({ initialValues, onSubmit }: Props) {
  const formik = useFormik<ProductForm>({
    initialValues: {
      ...defaultValues,
      ...initialValues
    },
    validationSchema: schema,
    onSubmit
  })

  const handleTagChange: any = async (key, values) => {
    await formik.setFieldValue(key, values)
  }

  const units = Object.keys(Unit).map(key => Unit[key]).filter(value => typeof value === 'string') as string[]

  return (
    <Pane padding={100}>
      <TextInputField
        isInvalid={formik.touched.name && !!formik.errors.name}
        required
        value={formik.values.name}
        onChange={formik.handleChange}
        name='name'
        label='Название'
        validationMessage={
          formik.touched.name && formik.errors.name
        }
      />
      <TextInputField
        isInvalid={formik.touched.price && !!formik.errors.price}
        required
        value={formik.values.price}
        onChange={formik.handleChange}
        name='price'
        label='Цена'
        validationMessage={formik.touched.price && !!formik.errors.price}
      />
      <FormField label='Единица измерения' marginBottom={24}>
        <Select width='100%' onChange={(val) => handleTagChange('unit', val.target.value)}>
          {
            units.map(v => (
              <option key={v} value={Unit[v]}>{v}</option>
            ))
          }
        </Select>
      </FormField>
      <TextInputField
        isInvalid={formik.touched.description && !!formik.errors.description}
        value={formik.values.description}
        onChange={formik.handleChange}
        name='description'
        label='Описание'
        validationMessage={formik.touched.description && formik.errors.description}
      />
      <TextInputField
        isInvalid={formik.touched.url && !!formik.errors.url}
        value={formik.values.url}
        onChange={formik.handleChange}
        name='url'
        label='Ссылка'
        validationMessage={formik.touched.url && formik.errors.url}
      />
      <FormField label='Метки' marginBottom={24}>
        <TagInput
          inputProps={{ placeholder: 'Метки...' }}
          values={formik.values.tags}
          onChange={(val) => handleTagChange('tags', val)}
          width='100%'
        />
      </FormField>
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
