This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## font uses

vazir

## icons

```
in this project use "React Icons" package
search icons from this site
https://react-icons.github.io/
```

Feather
remix icon

# Run in Production Mode 🚀🚀

-   first set sharp in environment

```bash
NEXT_SHARP_PATH=/tmp/node_modules/sharp
```

set environment for nodejs > 17

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

-   and start

```bash
yarn start
```

-   account page
-   edit profile page

### Responsive

-   [x] home
-   [x] product
-   [x] account
    -   [x] likes
    -   [ ] notifications
    -   [ ] orders
    -   [ ] addresses
    -   [ ] comments
-   [x] cart
-   [x] checkout
-   [x] login
-   [x] filter

per page = 1h
all page = 8h

services

```json

{
    home: 4
    product: 4
    account: 1 + logout
    likes: 1
    notifications: 1
    orders: 1
    addresses: 1
    comments: 1
    cart: 3
    checkout: 2
    login: 2
    filter: 3
}
```

configs = axios, hook, loading-container -> 1.5
time = 30m + 1h + 30m + 15m + 15m + 1h + 15m + 15m + 30m + 30m + 15m + 1h
total = 8h

dashboard
skeleton
verify sms
types shipping
time for due
categories
drawer menu
invoice pdf
edit profile
order detail
seo and google optimization

### TODO

payed date and payed id in order
tab in orders

-   add discount background number
