use anchor_lang::prelude::*;

declare_id!("AgYQGmnWbLEkwa5Et88XDf8W99L21Jr5yoGhScBixJCs");

#[program]
pub mod todo_app{
    use super::*;

    pub fn create_task(_ctx: Context<CreateTask>, task: String) -> Result<()>{
        msg!("Creating a todo app !");
        let todo = &mut _ctx.accounts.new_task;
        todo.owner = *_ctx.accounts.owner.key;
        todo.task = task;

        msg!("Task is created -> {:?}", todo);
        Ok(())
    }

    pub fn edit_completed(_ctx: Context<EditCompleted>, _task: String) -> Result<()> {
        let todo = &mut _ctx.accounts.task_to_edit;
        todo.completed = !todo.completed;

        if todo.completed {
            msg!("Task status is changed to Completed!")
        }else{
            msg!("Task status is changed to Incompleted!")
        }

        Ok(())
    }

    pub fn delete_task(_ctx: Context<DeleteTask>, task: String) -> Result<()> {
        msg!("Task {:?} is deleted successfully!" , task);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(task:String)]
pub struct CreateTask<'info>{

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + Task::INIT_SPACE,
        seeds = [b"task", task.as_bytes(), owner.key().as_ref()],
        bump
    )]
    pub new_task: Account<'info,Task>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(_task: String)]
pub struct EditCompleted<'info>{

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"task", _task.as_bytes(), owner.key().as_ref()],
        bump
    )]
    pub task_to_edit: Account<'info, Task>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(task: String)]
pub struct DeleteTask<'info>{

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"task", task.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner
    )]
    pub task_to_delete: Account<'info, Task>,

    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace, Debug)]
pub struct Task{
    
    pub owner: Pubkey,

    #[max_len(150)]
    pub task: String,

    pub completed: bool
}
