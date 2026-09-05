export type LoginTestDetails = {
  email: string
  password: string
}

export type SignupTestDetails = LoginTestDetails & {
  name: string
  username: string
}

export const customerTestDetails: SignupTestDetails = {
  name: "FoodIO Customer Test",
  username: "foodio_customer_test",
  email: "foodio.customer.test@example.com",
  password: "FoodIOTest123!",
}

export const foodioStudiosDemoDetails: LoginTestDetails = {
  email: "foodio.studios.demo@example.com",
  password: "TEST 123",
}

export const partnerTestDetails: SignupTestDetails = {
  name: "FoodIO Test User",
  username: "foodio_test_user1",
  email: "foodio.test1@example.com",
  password: "FoodIOTest123!",
}
export const adminTestDetails: LoginTestDetails = {
  email: "foodio.testadmin@example.com",
  password: "FoodIOTest123!",
}
