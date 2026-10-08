import { useEffect, useState } from 'react'
import './App.css'

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

function App() {
  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('expenseTrackerToken'))
  )

  const [authMode, setAuthMode] = useState('login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authMessage, setAuthMessage] = useState('')

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('expenseTrackerUser')

    if (!savedUser) {
      return null
    }

    try {
      return JSON.parse(savedUser)
    } catch {
      return null
    }
  })

  // Registration fields
  const [registerId, setRegisterId] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerAge, setRegisterAge] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  // =========================================================
  // EXPENSE STATES
  // =========================================================

  const [id, setId] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [activePage, setActivePage] = useState('dashboard')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [expensesDate, setExpensesDate] = useState('')

  const [expenses, setExpenses] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [errors, setErrors] = useState({})

  // =========================================================
  // USER STATES
  // =========================================================

  const [users, setUsers] = useState([])

  const [userIdForm, setUserIdForm] = useState('')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userAge, setUserAge] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userPassword, setUserPassword] = useState('')

  const [userEditingId, setUserEditingId] = useState(null)

  // =========================================================
  // PAYMENT METHOD STATES
  // =========================================================

  const [paymentMethods, setPaymentMethods] = useState([])

  const [paymentMethodIdForm, setPaymentMethodIdForm] = useState('')
  const [paymentMethodName, setPaymentMethodName] = useState('')
  const [paymentMethodEditingId, setPaymentMethodEditingId] =
    useState(null)

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem('expenseTrackerToken')
    localStorage.removeItem('expenseTrackerUser')

    setIsAuthenticated(false)
    setCurrentUser(null)

    setLoginEmail('')
    setLoginPassword('')
    setAuthError('')
    setAuthMessage('')

    setActivePage('dashboard')
  }

  // =========================================================
  // AUTHENTICATED FETCH
  // =========================================================

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('expenseTrackerToken')

    const headers = new Headers(options.headers || {})

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    if (
      options.body &&
      !(options.body instanceof FormData) &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (response.status === 401 || response.status === 403) {
      logout()

      throw new Error(
        'Your session has expired or is not authorized. Please login again.'
      )
    }

    return response
  }

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault()

    setAuthError('')
    setAuthMessage('')

    if (!loginEmail.trim()) {
      setAuthError('Email is required.')
      return
    }

    if (!loginPassword.trim()) {
      setAuthError('Password is required.')
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailid: loginEmail,
          password: loginPassword
        })
      })

      const responseText = await response.text()

      let data

      try {
        data = JSON.parse(responseText)
      } catch {
        data = responseText
      }

      if (!response.ok) {
        setAuthError(
          typeof data === 'object'
            ? data.message || 'Invalid email or password.'
            : data || 'Invalid email or password.'
        )

        return
      }

      localStorage.setItem(
        'expenseTrackerToken',
        data.token
      )

      localStorage.setItem(
        'expenseTrackerUser',
        JSON.stringify({
          userId: data.userId,
          name: data.name,
          emailid: data.emailid
        })
      )

      setCurrentUser({
        userId: data.userId,
        name: data.name,
        emailid: data.emailid
      })

      setIsAuthenticated(true)
      setActivePage('dashboard')

      setLoginEmail('')
      setLoginPassword('')
      setAuthError('')
    } catch (error) {
      console.error('Login error:', error)

      setAuthError(
        error.message || 'Unable to login.'
      )
    }
  }

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (e) => {
    e.preventDefault()

    setAuthError('')
    setAuthMessage('')

    if (!registerId) {
      setAuthError('User ID is required.')
      return
    }

    if (!registerName.trim()) {
      setAuthError('Name is required.')
      return
    }

    if (!registerEmail.trim()) {
      setAuthError('Email is required.')
      return
    }

    if (!registerAge || Number(registerAge) <= 0) {
      setAuthError('Age must be greater than 0.')
      return
    }

    if (!/^\d{10}$/.test(registerPhone)) {
      setAuthError(
        'Phone number must contain exactly 10 digits.'
      )
      return
    }

    if (!registerPassword.trim()) {
      setAuthError('Password is required.')
      return
    }

    if (registerPassword.length < 6) {
      setAuthError(
        'Password must contain at least 6 characters.'
      )
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: Number(registerId),
          name: registerName,
          emailid: registerEmail,
          age: Number(registerAge),
          phoneNO: registerPhone,
          password: registerPassword
        })
      })

      const responseText = await response.text()

      let data

      try {
        data = JSON.parse(responseText)
      } catch {
        data = responseText
      }

      if (!response.ok) {
        setAuthError(
          typeof data === 'object'
            ? data.message || JSON.stringify(data)
            : data || 'Registration failed.'
        )

        return
      }

      setAuthMessage(
        'Registration successful! Please login with your email and password.'
      )

      setAuthError('')

      setLoginEmail(registerEmail)
      setLoginPassword('')

      setRegisterId('')
      setRegisterName('')
      setRegisterEmail('')
      setRegisterAge('')
      setRegisterPhone('')
      setRegisterPassword('')

      setAuthMode('login')
    } catch (error) {
      console.error('Registration error:', error)

      setAuthError(
        error.message || 'Unable to register.'
      )
    }
  }

  // =========================================================
  // GET EXPENSES
  // =========================================================

  const getExpenses = async () => {
    try {
      const response = await authFetch('/api/expenses')

      if (!response.ok) {
        throw new Error('Failed to fetch expenses')
      }

      const data = await response.json()

      setExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  // =========================================================
  // GET USERS
  // =========================================================

  const getUsers = async () => {
    try {
      const response = await authFetch('/api/users')

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()

      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // =========================================================
  // GET PAYMENT METHODS
  // =========================================================

  const getPaymentMethods = async () => {
    try {
      const response = await authFetch(
        '/api/payment-methods'
      )

      if (!response.ok) {
        throw new Error(
          'Failed to fetch payment methods'
        )
      }

      const data = await response.json()

      setPaymentMethods(data)
    } catch (error) {
      console.error(
        'Error fetching payment methods:',
        error
      )
    }
  }

  // =========================================================
  // LOAD ALL DATA AFTER LOGIN
  // =========================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    getExpenses()
    getUsers()
    getPaymentMethods()
  }, [isAuthenticated])

  // =========================================================
  // DASHBOARD CALCULATIONS
  // =========================================================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  )

  const expenseCount = expenses.length

  const averageExpense =
    expenseCount > 0
      ? totalExpenses / expenseCount
      : 0

  // =========================================================
  // CATEGORY TOTALS
  // =========================================================

  const categoryTotals = expenses.reduce(
    (totals, expense) => {
      const expenseCategory =
        expense.category || 'Other'

      if (!totals[expenseCategory]) {
        totals[expenseCategory] = 0
      }

      totals[expenseCategory] += Number(
        expense.amount || 0
      )

      return totals
    },
    {}
  )

  // =========================================================
  // PIE CHART DATA
  // =========================================================

  const categoryChartData = Object.entries(
    categoryTotals
  ).map(([name, value]) => ({
    name,
    value
  }))

  // =========================================================
  // ADD / UPDATE EXPENSE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!category.trim()) {
      newErrors.category =
        'Category is required'
    }

    if (!amount || Number(amount) <= 0) {
      newErrors.amount =
        'Amount must be greater than 0'
    }

    if (!paymentMethodId) {
      newErrors.paymentMethodId =
        'Please select a payment method'
    }

    if (!expensesDate) {
      newErrors.expensesDate =
        'Date is required'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const expense = {
  id: Number(id),
  category: category,
  amount: Number(amount),
  expenses_date: expensesDate,

  user: {
    id: Number(currentUser.userId)
  },

  paymentMethod: {
    id: Number(paymentMethodId)
  }
}

    try {
      const url =
        editingId !== null
          ? `/api/expenses/${editingId}`
          : '/api/expenses'

      const method =
        editingId !== null
          ? 'PUT'
          : 'POST'

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(expense)
      })

      const responseText =
        await response.text()

      let data

      try {
        data = JSON.parse(responseText)
      } catch {
        data = responseText
      }

      if (!response.ok) {
        alert(
          typeof data === 'object'
            ? JSON.stringify(
                data,
                null,
                2
              )
            : data
        )

        return
      }

      alert(
        editingId !== null
          ? 'Expense updated successfully!'
          : 'Expense added successfully!'
      )

      await getExpenses()

      clearExpenseForm()
    } catch (error) {
      console.error(
        'Expense error:',
        error
      )

      alert(
        `Error: ${error.message}`
      )
    }
  }

  // =========================================================
  // EDIT EXPENSE
  // =========================================================

  const handleEdit = (expense) => {
    setEditingId(expense.id)

    setId(expense.id)

    setCategory(
      expense.category || ''
    )

    setAmount(
      expense.amount || ''
    )

    setExpensesDate(
      expense.expenses_date || ''
    )

    setUserId(
      expense.user?.id
        ? String(expense.user.id)
        : ''
    )

    setPaymentMethodId(
      expense.paymentMethod?.id
        ? String(
            expense.paymentMethod.id
          )
        : ''
    )

    setErrors({})

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // =========================================================
  // DELETE EXPENSE
  // =========================================================

  const handleDelete = async (
    expenseId
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this expense?'
      )

    if (!confirmed) {
      return
    }

    try {
      const response = await authFetch(
        `/api/expenses/${expenseId}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to delete expense'
        )
      }

      alert(
        'Expense deleted successfully!'
      )

      await getExpenses()
    } catch (error) {
      console.error(
        'Delete error:',
        error
      )

      alert(
        `Could not delete expense: ${error.message}`
      )
    }
  }

  // =========================================================
  // CLEAR EXPENSE FORM
  // =========================================================

  const clearExpenseForm = () => {
    setEditingId(null)

    setId('')
    setCategory('')
    setAmount('')
    setPaymentMethodId('')
    setExpensesDate('')

    setErrors({})
  }

  // =========================================================
  // ADD / UPDATE USER
  // =========================================================

  const handleUserSubmit = async (e) => {
    e.preventDefault()

    if (!userIdForm) {
      alert('User ID is required')
      return
    }

    if (!userName.trim()) {
      alert('Name is required')
      return
    }

    if (!userEmail.trim()) {
      alert('Email is required')
      return
    }

    if (
      !userAge ||
      Number(userAge) <= 0
    ) {
      alert(
        'Age must be greater than 0'
      )
      return
    }

    if (!/^\d{10}$/.test(userPhone)) {
      alert(
        'Phone number must contain exactly 10 digits'
      )
      return
    }

    // Password is required for a new user.
    // During edit, leaving it blank keeps
    // the existing password unchanged.
    if (
      userEditingId === null &&
      !userPassword.trim()
    ) {
      alert('Password is required')
      return
    }

    const user = {
      id: Number(userIdForm),
      name: userName,
      emailid: userEmail,
      age: Number(userAge),
      phoneNO: userPhone
    }

    if (userPassword.trim()) {
      user.password = userPassword
    }

    try {
      const url =
        userEditingId !== null
          ? `/api/users/${userEditingId}`
          : '/api/users'

      const method =
        userEditingId !== null
          ? 'PUT'
          : 'POST'

      const response = await authFetch(
        url,
        {
          method,
          body: JSON.stringify(user)
        }
      )

      const responseText =
        await response.text()

      let data

      try {
        data = JSON.parse(
          responseText
        )
      } catch {
        data = responseText
      }

      if (!response.ok) {
        alert(
          typeof data === 'object'
            ? JSON.stringify(
                data,
                null,
                2
              )
            : data
        )

        return
      }

      alert(
        userEditingId !== null
          ? 'User updated successfully!'
          : 'User added successfully!'
      )

      await getUsers()

      clearUserForm()
    } catch (error) {
      console.error(
        'User error:',
        error
      )

      alert(
        `Error: ${error.message}`
      )
    }
  }

  // =========================================================
  // EDIT USER
  // =========================================================

  const handleUserEdit = (
    user
  ) => {
    setUserEditingId(user.id)

    setUserIdForm(user.id)

    setUserName(
      user.name || ''
    )

    setUserEmail(
      user.emailid || ''
    )

    setUserAge(
      user.age || ''
    )

    setUserPhone(
      user.phoneNO || ''
    )

    // Never populate an existing password
    setUserPassword('')

    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior: 'smooth'
    })
  }

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleUserDelete = async (
    userIdToDelete
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this user?'
      )

    if (!confirmed) {
      return
    }

    try {
      const response = await authFetch(
        `/api/users/${userIdToDelete}`,
        {
          method: 'DELETE'
        }
      )

      const responseText =
        await response.text()

      if (!response.ok) {
        let data

        try {
          data =
            JSON.parse(
              responseText
            )
        } catch {
          data = responseText
        }

        alert(
          typeof data === 'object'
            ? JSON.stringify(
                data,
                null,
                2
              )
            : data
        )

        return
      }

      alert(
        'User deleted successfully!'
      )

      await getUsers()

      if (
        userEditingId ===
        userIdToDelete
      ) {
        clearUserForm()
      }
    } catch (error) {
      console.error(
        'User delete error:',
        error
      )

      alert(
        `Could not delete user: ${error.message}`
      )
    }
  }

  // =========================================================
  // CLEAR USER FORM
  // =========================================================

  const clearUserForm = () => {
    setUserEditingId(null)

    setUserIdForm('')
    setUserName('')
    setUserEmail('')
    setUserAge('')
    setUserPhone('')
    setUserPassword('')
  }

  // =========================================================
  // ADD / UPDATE PAYMENT METHOD
  // =========================================================

  const handlePaymentMethodSubmit =
    async (e) => {
      e.preventDefault()

      if (!paymentMethodIdForm) {
        alert(
          'Payment method ID is required'
        )
        return
      }

      if (!paymentMethodName.trim()) {
        alert(
          'Payment method name is required'
        )
        return
      }

      const paymentMethod = {
        id: Number(
          paymentMethodIdForm
        ),
        name: paymentMethodName
      }

      try {
        const url =
          paymentMethodEditingId !== null
            ? `/api/payment-methods/${paymentMethodEditingId}`
            : '/api/payment-methods'

        const method =
          paymentMethodEditingId !== null
            ? 'PUT'
            : 'POST'

        const response =
          await authFetch(
            url,
            {
              method,
              body: JSON.stringify(
                paymentMethod
              )
            }
          )

        const responseText =
          await response.text()

        let data

        try {
          data =
            JSON.parse(
              responseText
            )
        } catch {
          data =
            responseText
        }

        if (!response.ok) {
          alert(
            typeof data === 'object'
              ? JSON.stringify(
                  data,
                  null,
                  2
                )
              : data
          )

          return
        }

        alert(
          paymentMethodEditingId !== null
            ? 'Payment method updated successfully!'
            : 'Payment method added successfully!'
        )

        await getPaymentMethods()

        clearPaymentMethodForm()
      } catch (error) {
        console.error(
          'Payment method error:',
          error
        )

        alert(
          `Error: ${error.message}`
        )
      }
    }

  // =========================================================
  // EDIT PAYMENT METHOD
  // =========================================================

  const handlePaymentMethodEdit =
    (method) => {
      setPaymentMethodEditingId(
        method.id
      )

      setPaymentMethodIdForm(
        method.id
      )

      setPaymentMethodName(
        method.name || ''
      )

      window.scrollTo({
        top:
          document.body.scrollHeight,
        behavior: 'smooth'
      })
    }

  // =========================================================
  // DELETE PAYMENT METHOD
  // =========================================================

  const handlePaymentMethodDelete =
    async (
      paymentMethodIdToDelete
    ) => {
      const confirmed =
        window.confirm(
          'Are you sure you want to delete this payment method?'
        )

      if (!confirmed) {
        return
      }

      try {
        const response =
          await authFetch(
            `/api/payment-methods/${paymentMethodIdToDelete}`,
            {
              method: 'DELETE'
            }
          )

        const responseText =
          await response.text()

        if (!response.ok) {
          let data

          try {
            data =
              JSON.parse(
                responseText
              )
          } catch {
            data =
              responseText
          }

          alert(
            typeof data === 'object'
              ? JSON.stringify(
                  data,
                  null,
                  2
                )
              : data
          )

          return
        }

        alert(
          'Payment method deleted successfully!'
        )

        await getPaymentMethods()

        if (
          paymentMethodEditingId ===
          paymentMethodIdToDelete
        ) {
          clearPaymentMethodForm()
        }
      } catch (error) {
        console.error(
          'Payment method delete error:',
          error
        )

        alert(
          `Could not delete payment method: ${error.message}`
        )
      }
    }

  // =========================================================
  // CLEAR PAYMENT METHOD FORM
  // =========================================================

  const clearPaymentMethodForm =
    () => {
      setPaymentMethodEditingId(null)
      setPaymentMethodIdForm('')
      setPaymentMethodName('')
    }

  // =========================================================
  // AUTH SCREEN
  // =========================================================

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '30px',
          background:
            'linear-gradient(135deg, #eef2ff, #fdf2f8, #ecfeff)'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            background: '#ffffff',
            borderRadius: '24px',
            padding: '35px',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.12)'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '28px'
            }}
          >
            <div
              style={{
                fontSize: '46px',
                marginBottom: '8px'
              }}
            >
              💰
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: '30px',
                background:
                  'linear-gradient(90deg, #6366f1, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:
                  'transparent'
              }}
            >
              Expense Tracker
            </h1>

            <p
              style={{
                color: '#64748b',
                marginTop: '8px'
              }}
            >
              Manage your money smarter
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '24px'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setAuthMode('login')
                setAuthError('')
                setAuthMessage('')
              }}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                background:
                  authMode === 'login'
                    ? '#6366f1'
                    : '#e2e8f0',
                color:
                  authMode === 'login'
                    ? '#ffffff'
                    : '#334155'
              }}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register')
                setAuthError('')
                setAuthMessage('')
              }}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                background:
                  authMode === 'register'
                    ? '#ec4899'
                    : '#e2e8f0',
                color:
                  authMode === 'register'
                    ? '#ffffff'
                    : '#334155'
              }}
            >
              Register
            </button>
          </div>

          {authError && (
            <div
              style={{
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '10px',
                background: '#fee2e2',
                color: '#991b1b'
              }}
            >
              {authError}
            </div>
          )}

          {authMessage && (
            <div
              style={{
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '10px',
                background: '#dcfce7',
                color: '#166534'
              }}
            >
              {authMessage}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label>Email</label>

                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) =>
                    setLoginEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label>Password</label>

                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) =>
                    setLoginPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#6366f1',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '14px' }}>
                <label>User ID</label>

                <input
                  type="number"
                  value={registerId}
                  onChange={(e) =>
                    setRegisterId(
                      e.target.value
                    )
                  }
                  placeholder="Enter user ID"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label>Name</label>

                <input
                  type="text"
                  value={registerName}
                  onChange={(e) =>
                    setRegisterName(
                      e.target.value
                    )
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label>Email</label>

                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) =>
                    setRegisterEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label>Age</label>

                <input
                  type="number"
                  value={registerAge}
                  onChange={(e) =>
                    setRegisterAge(
                      e.target.value
                    )
                  }
                  placeholder="Enter your age"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label>Phone</label>

                <input
                  type="text"
                  value={registerPhone}
                  onChange={(e) =>
                    setRegisterPhone(
                      e.target.value
                    )
                  }
                  placeholder="10 digit phone number"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label>Password</label>

                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) =>
                    setRegisterPassword(
                      e.target.value
                    )
                  }
                  placeholder="Create a password"
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#ec4899',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  // =========================================================
  // MAIN APPLICATION
  // =========================================================

  return (
    <div>
      <nav className="navbar">

        <div className="brand-section">
          <div className="brand-icon">💰</div>

          <div>
            <div className="brand-title">
              Expense Tracker
            </div>

            <div className="brand-subtitle">
              Manage your money smarter
            </div>
          </div>
        </div>

        <div className="nav-links">

          <button
            type="button"
            className={
              activePage === 'dashboard'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage('dashboard')
            }
          >
            📊 Dashboard
          </button>

          <button
            type="button"
            className={
              activePage === 'expenses'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage('expenses')
            }
          >
            💸 Expenses
          </button>

          <button
            type="button"
            className={
              activePage === 'users'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage('users')
            }
          >
            👤 Users
          </button>

          <button
            type="button"
            className={
              activePage === 'paymentMethods'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage(
                'paymentMethods'
              )
            }
          >
            💳 Payment Methods
          </button>

          <span
            style={{
              marginLeft: '10px',
              fontWeight: '600',
              color: '#475569'
            }}
          >
            Hi, {currentUser?.name || 'User'}
          </span>

          <button
            type="button"
            onClick={logout}
            style={{
              background: '#ef4444',
              color: '#ffffff'
            }}
          >
            Logout
          </button>

        </div>

      </nav>

      <div className="page-heading">

        <h1>
          {activePage === 'dashboard' &&
            'Dashboard'}

          {activePage === 'expenses' &&
            'Expense Management'}

          {activePage === 'users' &&
            'User Management'}

          {activePage === 'paymentMethods' &&
            'Payment Methods'}
        </h1>

        <p>
          {activePage === 'dashboard' &&
            'Overview of your spending'}

          {activePage === 'expenses' &&
            'Track and manage your expenses'}

          {activePage === 'users' &&
            'Manage your application users'}

          {activePage === 'paymentMethods' &&
            'Manage your payment options'}
        </p>

      </div>

      {/* ================================================= */}
      {/* DASHBOARD */}
      {/* ================================================= */}

      {activePage === 'dashboard' && (
        <>
          <div className="dashboard">

            <div className="summary-card">
              <h3>Total Expenses</h3>

              <p>
                ₹{totalExpenses.toFixed(2)}
              </p>
            </div>

            <div className="summary-card">
              <h3>Number of Expenses</h3>

              <p>
                {expenseCount}
              </p>
            </div>

            <div className="summary-card">
              <h3>Average Expense</h3>

              <p>
                ₹{averageExpense.toFixed(2)}
              </p>
            </div>

          </div>

          <div className="category-section">

            <h2>
              Spending by Category
            </h2>

            {Object.keys(
              categoryTotals
            ).length === 0 ? (

              <p>
                No category data available.
              </p>

            ) : (

              <div className="category-grid">

                {Object.entries(
                  categoryTotals
                ).map(
                  ([expenseCategory, total]) => (

                    <div
                      className="category-card"
                      key={expenseCategory}
                    >
                      <h3>
                        {expenseCategory}
                      </h3>

                      <p>
                        ₹{total.toFixed(2)}
                      </p>
                    </div>

                  )
                )}

              </div>
            )}

          </div>

          <div className="chart-container">

            <h2>
              Expense Distribution
            </h2>

            {categoryChartData.length === 0 ? (

              <p>
                No expense data available.
              </p>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <PieChart>

                  <Pie
                    data={
                      categoryChartData
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  />

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>
            )}

          </div>

          <div className="recent-expenses">

            <h2>
              Recent Expenses
            </h2>

            {expenses.length === 0 ? (

              <p>
                No recent expenses.
              </p>

            ) : (

              expenses
                .slice(-5)
                .reverse()
                .map((expense) => (

                  <div
                    className="recent-expense-item"
                    key={expense.id}
                  >
                    <div>
                      <strong>
                        {expense.category}
                      </strong>

                      <span>
                        {expense.expenses_date}
                      </span>
                    </div>

                    <strong>
                      ₹
                      {Number(
                        expense.amount
                      ).toFixed(2)}
                    </strong>
                  </div>

                ))
            )}

          </div>
        </>
      )}

      {/* ================================================= */}
      {/* EXPENSE MANAGEMENT */}
      {/* ================================================= */}

      {activePage === 'expenses' && (
        <>

          <h2>
            {editingId !== null
              ? 'Edit Expense'
              : 'Add Expense'}
          </h2>

          <form
            onSubmit={handleSubmit}
          >

            <div>
              <label>
                Expense ID:
              </label>

              <input
                type="number"
                value={id}
                onChange={(e) =>
                  setId(
                    e.target.value
                  )
                }
                disabled={
                  editingId !== null
                }
              />
            </div>

            <div>
              <label>
                Category:
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) => {
                  setCategory(
                    e.target.value
                  )

                  setErrors({
                    ...errors,
                    category: ''
                  })
                }}
              />

              {errors.category && (
                <p>
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label>
                Amount:
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(
                    e.target.value
                  )

                  setErrors({
                    ...errors,
                    amount: ''
                  })
                }}
              />

              {errors.amount && (
                <p>
                  {errors.amount}
                </p>
              )}
            </div>

            <div
  style={{
    padding: '14px',
    background: '#eef2ff',
    borderRadius: '10px',
    marginBottom: '16px'
  }}
>
  <strong>Logged in as: </strong>
  {currentUser?.name || 'User'}
</div>

            <div>
              <label>
                Payment Method:
              </label>

              <select
                value={
                  paymentMethodId
                }
                onChange={(e) => {
                  setPaymentMethodId(
                    e.target.value
                  )

                  setErrors({
                    ...errors,
                    paymentMethodId: ''
                  })
                }}
              >
                <option value="">
                  Select Payment Method
                </option>

                {paymentMethods.map(
                  (method) => (
                    <option
                      key={method.id}
                      value={method.id}
                    >
                      {method.name}
                    </option>
                  )
                )}
              </select>

              {errors.paymentMethodId && (
                <p>
                  {errors.paymentMethodId}
                </p>
              )}
            </div>

            <div>
              <label>
                Date:
              </label>

              <input
                type="date"
                value={expensesDate}
                onChange={(e) => {
                  setExpensesDate(
                    e.target.value
                  )

                  setErrors({
                    ...errors,
                    expensesDate: ''
                  })
                }}
              />

              {errors.expensesDate && (
                <p>
                  {errors.expensesDate}
                </p>
              )}
            </div>

            <button type="submit">
              {editingId !== null
                ? 'Update Expense'
                : 'Add Expense'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={
                  clearExpenseForm
                }
              >
                Cancel
              </button>
            )}

          </form>

          <hr />

          <h2>
            All Expenses
          </h2>

          {expenses.length === 0 ? (

            <p>
              No expenses found.
            </p>

          ) : (

            expenses.map(
              (expense) => (

                <div
                  className="expense-card"
                  key={expense.id}
                >

                  <p>
                    <strong>
                      ID:
                    </strong>{' '}
                    {expense.id}
                  </p>

                  <p>
                    <strong>
                      Category:
                    </strong>{' '}
                    {expense.category}
                  </p>

                  <p>
                    <strong>
                      Amount:
                    </strong>{' '}
                    ₹{expense.amount}
                  </p>

                  <p>
                    <strong>
                      Date:
                    </strong>{' '}
                    {expense.expenses_date}
                  </p>

                  <p>
                    <strong>
                      User:
                    </strong>{' '}
                    {expense.user?.name ||
                      'N/A'}
                  </p>

                  <p>
                    <strong>
                      Payment Method:
                    </strong>{' '}
                    {expense.paymentMethod
                      ?.name ||
                      'N/A'}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        expense
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        expense.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              )
            )
          )}

        </>
      )}

      {/* ================================================= */}
      {/* USER MANAGEMENT */}
      {/* ================================================= */}

      {activePage === 'users' && (
        <>
          <hr />

          <h2>
            {userEditingId !== null
              ? 'Edit User'
              : 'User Management'}
          </h2>

          <form
            onSubmit={
              handleUserSubmit
            }
          >

            <div>
              <label>
                User ID:
              </label>

              <input
                type="number"
                value={
                  userIdForm
                }
                onChange={(e) =>
                  setUserIdForm(
                    e.target.value
                  )
                }
                disabled={
                  userEditingId !== null
                }
              />
            </div>

            <div>
              <label>
                Name:
              </label>

              <input
                type="text"
                value={userName}
                onChange={(e) =>
                  setUserName(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>
                Email:
              </label>

              <input
                type="email"
                value={userEmail}
                onChange={(e) =>
                  setUserEmail(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>
                Age:
              </label>

              <input
                type="number"
                value={userAge}
                onChange={(e) =>
                  setUserAge(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>
                Phone:
              </label>

              <input
                type="text"
                value={userPhone}
                onChange={(e) =>
                  setUserPhone(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>
                Password:
              </label>

              <input
                type="password"
                value={userPassword}
                onChange={(e) =>
                  setUserPassword(
                    e.target.value
                  )
                }
                placeholder={
                  userEditingId !== null
                    ? 'Leave blank to keep current password'
                    : 'Enter password'
                }
              />
            </div>

            <button type="submit">
              {userEditingId !== null
                ? 'Update User'
                : 'Add User'}
            </button>

            {userEditingId !== null && (
              <button
                type="button"
                onClick={
                  clearUserForm
                }
              >
                Cancel
              </button>
            )}

          </form>

        </>
      )}

      {/* ================================================= */}
      {/* ALL USERS */}
      {/* ================================================= */}

      {activePage === 'users' && (
        <>
          <h2>
            All Users
          </h2>

          {users.length === 0 ? (

            <p>
              No users found.
            </p>

          ) : (

            users.map(
              (user) => (

                <div
                  className="user-card"
                  key={user.id}
                >

                  <p>
                    <strong>
                      ID:
                    </strong>{' '}
                    {user.id}
                  </p>

                  <p>
                    <strong>
                      Name:
                    </strong>{' '}
                    {user.name}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{' '}
                    {user.emailid}
                  </p>

                  <p>
                    <strong>
                      Age:
                    </strong>{' '}
                    {user.age}
                  </p>

                  <p>
                    <strong>
                      Phone:
                    </strong>{' '}
                    {user.phoneNO}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleUserEdit(
                        user
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleUserDelete(
                        user.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              )
            )
          )}
        </>
      )}

      {/* ================================================= */}
      {/* PAYMENT METHOD MANAGEMENT */}
      {/* ================================================= */}

      {activePage === 'paymentMethods' && (
        <>
          <hr />

          <h2>
            {paymentMethodEditingId !== null
              ? 'Edit Payment Method'
              : 'Payment Method Management'}
          </h2>

          <form
            onSubmit={
              handlePaymentMethodSubmit
            }
          >

            <div>
              <label>
                Payment Method ID:
              </label>

              <input
                type="number"
                value={
                  paymentMethodIdForm
                }
                onChange={(e) =>
                  setPaymentMethodIdForm(
                    e.target.value
                  )
                }
                disabled={
                  paymentMethodEditingId !== null
                }
              />
            </div>

            <div>
              <label>
                Name:
              </label>

              <input
                type="text"
                value={
                  paymentMethodName
                }
                onChange={(e) =>
                  setPaymentMethodName(
                    e.target.value
                  )
                }
              />
            </div>

            <button type="submit">
              {paymentMethodEditingId !== null
                ? 'Update Payment Method'
                : 'Add Payment Method'}
            </button>

            {paymentMethodEditingId !== null && (
              <button
                type="button"
                onClick={
                  clearPaymentMethodForm
                }
              >
                Cancel
              </button>
            )}

          </form>
        </>
      )}

      {/* ================================================= */}
      {/* ALL PAYMENT METHODS */}
      {/* ================================================= */}

      {activePage === 'paymentMethods' && (
        <>
          <h2>
            All Payment Methods
          </h2>

          {paymentMethods.length === 0 ? (

            <p>
              No payment methods found.
            </p>

          ) : (

            paymentMethods.map(
              (method) => (

                <div
                  className="user-card"
                  key={method.id}
                >

                  <p>
                    <strong>
                      ID:
                    </strong>{' '}
                    {method.id}
                  </p>

                  <p>
                    <strong>
                      Name:
                    </strong>{' '}
                    {method.name}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handlePaymentMethodEdit(
                        method
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePaymentMethodDelete(
                        method.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              )
            )
          )}
        </>
      )}

    </div>
  )
}

export default App