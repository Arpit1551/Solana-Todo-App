import './App.css'
import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { createTask, editTask, fetchAllTask, deleteTask } from "./contract.jsx";
import { ToastContainer, toast } from 'react-toastify';

function App() {

  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState<any[]>([]);
  const [getData, setGetData] = useState(false);
  const [block, setBlock] = useState(false);

  const wallet = useWallet();
  const anchorWallet = wallet.publicKey
    ? {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    }
    : null;

  const createTaskHandler = async () => {
    if (!wallet.connected) return toast.error("Wallet is not connected");
    if (task.length == 0) return toast.error("Enter a valid task.");
    if (block) return toast.error("Wait for previous transaction to complete");

    setBlock(true);

    const ans = await createTask(task, anchorWallet, wallet.publicKey);

    if (ans.status == 200) {
      setTask("");
      toast.success("New task added successfully!");
    } else {
      toast.error("Something went wrong!");
    }

    setBlock(false);
    setGetData(!getData);
  };


  const editTaskHandler = async (updatedTask: string) => {
    if (!wallet.connected) return toast.error("Wallet is not connected");
    if (block) return toast.error("Wait for previous transaction to complete");
    
    setBlock(true);
    
    const tx: any = await editTask(updatedTask, anchorWallet, wallet.publicKey);
    
    if (tx.status == 200) {
      toast.success("Task status changed successfully!");
      setGetData(!getData);
    };
    
    if (tx.status == 400) {
      toast.error("Someting went wrong!");
    }
    
    setBlock(false);
  }
  
  const deleteTaskHandler = async (taskName: string) => {
    if (!wallet.connected) return toast.error("Wallet is not connected");
    if (block) return toast.error("Wait for previous transaction to complete");

    setBlock(true);

    let tx: any = await deleteTask(taskName, anchorWallet, wallet.publicKey);
    if (tx.status == 200) {
      toast.success("Task deleted successfully!");
      setGetData(!getData);
    };

    if (tx.status == 400) {
      toast.error("Someting went wrong!");
    }

    setBlock(false);
    setGetData(!getData);
  }

  useEffect(() => {
    const fetchTasks = async () => {
      if (!wallet.connected) return;

      const tasks = await fetchAllTask(anchorWallet, wallet.publicKey);
      setTaskList(tasks);
    };
    fetchTasks();
  }, [wallet.connected, wallet.publicKey, getData]);

  return (
    <div className="app-container">

      <div className="header">
        <h1>Web3 Todo App</h1>
        <WalletMultiButton />
      </div>

      <div className="input-card">
        <input
          type="text"
          className="task-input"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <button className="btn create" onClick={createTaskHandler}>Create</button>
      </div>

      <div className="task-list">
        {taskList.map((task, index) => {
          return (
            <div key={index} className="task-card">

              <div className="task-row">

                <div className="task-left">
                  <h1>{task.account.task}</h1>
                  <h2>
                    {task.account.completed ? (
                      <span className="completed">Completed</span>
                    ) : (
                      <span className="not-completed">Not Completed</span>
                    )}
                  </h2>
                </div>

                <div className="task-right">

                  <button
                    className="mini-btn yellow"
                    onClick={() => editTaskHandler(task.account.task)}
                  >
                    {task.account.completed ? "Mark Incomplete" : "Mark Completed"}
                  </button>

                  <button
                    className="mini-btn red"
                    onClick={() => deleteTaskHandler(task.account.task)}
                  >
                    🗑
                  </button>

                </div>

              </div>

            </div>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;

