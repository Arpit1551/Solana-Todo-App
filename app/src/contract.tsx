import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import * as anchor from "@coral-xyz/anchor"
import IDL from "../../target/idl/todo_app.json"
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

const network = "http://localhost:8899";

const getProvider = (anchorWallet: any) => {

    try {
        const connection = new Connection(network, "processed");

        const provider = new anchor.AnchorProvider(connection, anchorWallet);

        return provider;
    } catch (error) {
        console.log("Unable to create a provider!");
        return error;
    }
};

const getPda = (task: string, wallet: any, program: any) => {
    const [taskPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("task"), Buffer.from(task), wallet.toBuffer()],
        program.programId
    )

    return taskPda;
}

export async function createTask(task: string, anchorWallet: any, wallet: any) {

    const provider: any = getProvider(anchorWallet);
    const program = new anchor.Program(IDL, provider);

    const taskPda = getPda(task, wallet, program);

    try {
        const tx = await program.methods
            .createTask(task)
            .accounts({
                owner: wallet,
                newTask: taskPda,
                systemProgram: SystemProgram.programId
            })
            .rpc();

        const createdTask = await (program.account as any).task.fetch(taskPda);
        return { status: 200, task: createdTask };

    } catch (error) {
        return { status: 400, ans: error };
    }
};

export async function editTask(task: string, anchorWallet: any, wallet: any) {

    const provider: any = getProvider(anchorWallet);
    const program = new anchor.Program(IDL, provider);

    const taskPda = getPda(task, wallet, program);

    try {
        const tx = await program.methods
            .editCompleted(task)
            .accounts({
                owner: wallet,
                taskToEdit: taskPda,
                systemProgram: SystemProgram.programId
            })
            .rpc();

        return { status: 200, task: tx };

    } catch (error) {
        return { status: 400, ans: error };
    }
};

export async function fetchAllTask(anchorWallet: any, wallet: any) {

    const provider: any = getProvider(anchorWallet);
    const program = new anchor.Program(IDL, provider);

    const tasks = await (program.account as any).task.all([
        {
            memcmp: {
                offset: 8,
                bytes: wallet
            }
        },
    ]);

    return tasks;
}

export async function deleteTask(task: string, anchorWallet: any, wallet: any) {

    const provider: any = getProvider(anchorWallet);
    const program = new anchor.Program(IDL, provider);

    const taskPda = getPda(task, wallet, program);

    try {
        const tx = await program.methods
            .deleteTask(task)
            .accounts({
                owner: wallet,
                taskToDelete: taskPda,
                systemProgram: SystemProgram.programId
            })
            .rpc();

        return { status: 200, task: tx };

    } catch (error) {
        return { status: 400, ans: error };
    }
}
