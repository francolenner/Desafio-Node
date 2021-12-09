const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()

app.use(express.json()) 

/* NUNCA faça isso na vida real, só está sendo utilizada para entender -> const orders = [] */
const orders = []

const middlewaresUrl = (request, response, next) => {
    request.method
    request.url

    next()
}

const middlewaresId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({ error: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}


app.post('/orders', middlewaresUrl, (request, response) => {
    const { order, clientName, price, status } = request.body
    const client = { id: uuid.v4(), order, clientName, price, status }


    orders.push(client)

    return response.status(201).json(client) 
})

app.get('/orders', middlewaresUrl, (request, response) => {

    return response.json(orders) 
})

app.put('/orders/:id', middlewaresId, middlewaresUrl, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrders = { id, order, clientName, price, status }

    orders[index] = updateOrders

    return response.json(updateOrders) 
})

app.delete('/orders/:id', middlewaresId, middlewaresUrl, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json() 
})

app.get('/orders/:id', middlewaresId, middlewaresUrl, (request, response) => {
    const index = request.orderIndex

    return response.json(orders[index])
})

app.patch('/orders/:id', middlewaresId, middlewaresUrl, (request, response) => {
    const index = request.orderIndex
    const { order, clientName, price, status } = request.body

    orders[index].status = "Pronto"
    
    return response.json(orders[index])
})

app.listen(port, () => {
    console.log(`🚀 The hamburger shop is already open at door ${port}`)
})

// npm run dev