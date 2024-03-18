const Razorpay=require("razorpay")

const razorpay=new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
})

createOrder= async(req,res)=>{
    const amount=req.body.amount
    const month=req.body.month
    const options={
        amount,
        currency:"INR",
        receipt:"order_rcptid_11"
    };
    try{
        const order=await razorpay.orders.create(options);
        res.json({orderId:order.id,amount,month})
    }catch{
        res.status(500).json({error:error.message})
    }
}

module.exports={
    createOrder,
}