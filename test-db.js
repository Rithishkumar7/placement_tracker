const mongoose = require('mongoose');

const uri = "mongodb+srv://rithishjanjeerapu007:rithesh01@rithesh.3fcrg3x.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const stores = db.collection('stores');
  const userStore = await stores.findOne({ userId: 'user-1' });
  
  if (!userStore) {
    console.log("No store found for user-1");
  } else {
    const storeData = userStore.storeData;
    console.log("Store found! Keys:", Object.keys(storeData));
    const state = storeData.state || storeData;
    if (state.roadmap) {
      const completedTasks = state.roadmap.flatMap(d => d.tasks.filter(t => t.completed).map(t => ({ day: d.date, title: t.title })));
      console.log(`Total completed roadmap tasks in DB: ${completedTasks.length}`);
      console.log(completedTasks);
    }
    if (state.todos) {
      console.log(`Total todos in DB: ${state.todos.length}`);
    }
    console.log(`Last Todo Reminder Date: ${state.lastTodoReminderDate}`);
  }
  process.exit(0);
}

run().catch(console.error);
