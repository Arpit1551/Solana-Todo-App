import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoApp } from "../target/types/todo_app";
import { PublicKey } from "@solana/web3.js";

describe("todo_app", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.todoApp as Program<TodoApp>;

  it("Task one is created!", async () => {
    const task: string = "Drink Water";

    const [taskPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("task"), Buffer.from(task), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods.createTask(task).accounts({ owner: provider.wallet.publicKey }).rpc();

    const taskAccount = await program.account.task.fetch(taskPda);

    console.log("The created account is -> ", taskAccount);
  });

  it("Task two is created!", async () => {
    const taskTwo: string = "Eat Food!";
    await program.methods.createTask(taskTwo).accounts({ owner: provider.wallet.publicKey }).rpc();
  })

  it("Task three is created!", async () => {
    const taskThree: string = "Play chess!";
    await program.methods.createTask(taskThree).accounts({ owner: provider.wallet.publicKey }).rpc();
  })

  it("Task two completion status edited!", async () => {
    const taskTwo: string = "Eat Food!";
    await program.methods.editCompleted(taskTwo).accounts({ owner: provider.wallet.publicKey }).rpc();
  })

  it("All the account created by the owner are !", async () => {
    const owner = 'G7yfsm3mpFFzozdmwKksy7Y3Vrb6uj9FXKLSRTfWyJEm';
    const tasks = await program.account.task.all([
      {
        // User this when you want to access all the account created by this owner
        memcmp: {
          offset: 8,
          bytes: owner
        },
        // memcmp: {
        //   offset: 44,
        //   bytes: Buffer.from("Drink Water").toString("base64"), 
        // },
      },
    ]);
    console.log(tasks);
  });
  
  it("Deleting task three!", async () => {
    const taskThree: string = "Play chess!";
    program.methods.deleteTask(taskThree).accounts({ owner: provider.wallet.publicKey }).rpc();
  });
  
    it("All the account created by the owner are !", async () => {
      const owner = 'G7yfsm3mpFFzozdmwKksy7Y3Vrb6uj9FXKLSRTfWyJEm';
      const tasks = await program.account.task.all([
        {
          // User this when you want to access all the account created by this owner
          memcmp: {
            offset: 8,
            bytes: owner
          },
          // memcmp: {
          //   offset: 44,
          //   bytes: Buffer.from("Drink Water").toString("base64"), 
          // },
        },
      ]);
      console.log(tasks);
    });

});
