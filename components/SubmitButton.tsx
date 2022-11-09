import React from "react"
import { Button, Spinner } from "react-bootstrap"

const SubmitButton = ({ isLoading, isDisabled = false }: { isLoading: boolean; isDisabled?: boolean }) => {
  return isLoading ? (
    <Button variant="primary" type="submit" disabled>
      <Spinner style={{ marginRight: 5 }} animation="border" as="span" size="sm" role="status" aria-hidden="true" />
      Loading...
    </Button>
  ) : (
    <Button variant="primary" type="submit" disabled={isDisabled}>
      Submit
    </Button>
  )
}

export default SubmitButton
