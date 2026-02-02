import express from "express";
import Thread from "./../models/Thread.js";
import getOpenAPIResponse from "./../utils/openai.js";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";

//test
// router.post("/test",async(req,res)=>{
//     try{
//         const thread=new Thread({
//             threadId:"xyz",
//             title:"test the router"
//         });
//        const respo= await thread.save();
//        res.send(respo);
//     }catch(err){
//      console.log(err);
//      res.status(500).json("error");
//     }
// })

//get all threads

router.get("/thread", authMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });
    res.send(threads);
    //desc of updated
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

//one chart featch
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const resp = await Thread.findOne({ threadId, userId: req.user.id });
    if (!resp) {
      res.status(404).json({ error: "Thread is not found" });
    }
    res.json(resp.message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});
//delete
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const resp = await Thread.findOneAndDelete({
      threadId,
      userId: req.user.id,
    });

    if (!resp) {
      res.status(404).json({ error: "Thread cant be deleted" });
    }
    res.status(200).json({ success: "the chart is deleted " });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", authMiddleware, async (req, res) => {
  let { threadId, message } = req.body;
  console.log(threadId, "thread", message);
  if (!threadId || !message) {
    res.status(400).json({ error: "missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId, userId: req.user.id });
    if (!thread) {
      thread = new Thread({
        userId: req.user.id,
        threadId,
        title: message,
        message: [{ role: "user", content: message }],
      });
    } else {
      thread.message.push({ role: "user", content: message });
    }
    const ass = await getOpenAPIResponse(message);
    thread.message.push({ role: "assistant", content: ass });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: ass });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to store thread" });
  }
});
export default router;
