// =========================================================================== state

const verbose = true;

const taskAsColClasses = 'col-xl-1 col-md-3 col-sm-12';


function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
}
// initial state:
const initial_iteration = 0;

const initial_incomingTasks = [{
        client: 1,
        fileName: "asdasd",
        fileSize: 6,
        whenAdded: 5,
    },
    {
        client: 2,
        fileName: "qweqwe",
        fileSize: 1,
        whenAdded: 5,
    },
    {
        client: 3,
        fileName: "ghjghj",
        fileSize: 4,
        whenAdded: 5,
    }
];

const initial_queue = [{
    client: 4,
    fileName: "ytryty",
    fileSize: 1,
    whenAdded: 0,
    whenAddedQueue: 0,
    priority: null,
}];

const initial_nextTask = null;

const initial_drives = [{
        id: 1,
        runningTask: {
            client: 1,
            fileName: "q_asdasd",
            fileSize: 5,
            done: 1,
        },
    },
    {
        id: 2,
        runningTask: null,
    },
    {
        id: 3,
        runningTask: {
            client: 2,
            fileName: "q_rttre",
            fileSize: 8,
            done: 0,
        },
    },
    {
        id: 4,
        runningTask: {
            client: 3,
            fileName: "q_popopo",
            fileSize: 12,
            done: 5,
        },
    },
    {
        id: 5,
        runningTask: null,
    }
];

const initial_finishedTasks = [];

const initial_clients = [{
        id: 1,
        classes: 'client1'
    },
    {
        id: 2,
        classes: 'client2'
    },
    {
        id: 3,
        classes: 'client3'
    },
    {
        id: 4,
        classes: 'client4'
    },
    {
        id: 5,
        classes: 'client5'
    }
];




var generatedState = null;
var state = {
    iteration: initial_iteration,
    incomingTasks: initial_incomingTasks,
    queue: initial_queue,
    nextTask: initial_nextTask,
    drives: initial_drives,
    finishedTasks: initial_finishedTasks,
    clients: initial_clients,
};


var stateHistory = [];

function stepForward() {
    state.iteration += 1;
    let newState = mainLoop(state);
    stateHistory.push(newState);
    state = newState;
}

function stepBackwards() {
    if (stateHistory.length >= 2) {
        stateHistory.pop();
        state = stateHistory[stateHistory.length-1];
    }
}

function taskAsHtml(t) {
    return taskAsHtml(t, '');
}

function taskAsHtml(t, additionalClasses) {
    if (!t) {
        return '(empty)';
    }

    let client = initial_clients.find(c => c.id == t.client);
    let done = 'done' in t ? t.done : 0;
    return `
    <div class="row m-0 p-0 single-task-container w-100 ${client.classes} ${additionalClasses}">

    
        <div class="${additionalClasses ? 'col-12' : 'col-auto'} task-priority-box">
            ${'priority' in t ? t.priority : '-'}
        </div>
        <div class=" ${additionalClasses ? 'col p-1' : 'col'} text-left">
            ${t.fileName}
        </div>
        <div class="${additionalClasses ? 'col-auto p-1' : 'col-4'} text-right">
        ${done}/${t.fileSize}
        </div>

        <div class="${additionalClasses ? 'col-12' : 'col-12'} p-0 progress-col">
            <progress max="${t.fileSize}" ${'done' in t ? `value="${done}"` : ''}>
            
            </progress>
            
        </div>
        



        
    </div>
    `;
    // return `
    // <div class="single-task-container w-100 ${clientClasses.classes}">
    //     client:${t.client}<br>
    //     fileName:${t.fileName}<br>
    //     fileSize:${t.fileSize}<br>
    //     whenAdded:${t.whenAdded}<br>

    //     ${'whenAddedQueue' in t ? 'whenAddedQueue:'+ t.whenAddedQueue + '<br>' : ''}
    //     ${'priority' in t ? 'priority:' + t.priority + '<br>' : ''}

    //     ${'done' in t ? 'done:' + t.done + '<br>' : ''}
    // </div>
    // `;
}

function generateState() {
    let randomState = {
        iteration: 0,
        incomingTasks: [],
        queue: [],
        nextTask: null,
        drives: initial_drives,
        finishedTasks: [],
        clients: initial_clients,
    };

    randomState.drives.forEach(d => d.runningTask = null);

    //client 1 = big files
    //var item = items[Math.floor(Math.random() * items.length)];


    for (let i = 0; i < 3; i++) {
        let newTask = {
            client: 1,
            fileName: lorem[rand(0, lorem.length)],
            fileSize: rand(500, 1500),
            whenAdded: 0,
        }
        randomState.incomingTasks.push(newTask);
    }

    //client 5 = many small files
    for (let i = 0; i < 20; i++) {
        let newTask = {
            client: 5,
            fileName: lorem[rand(0, lorem.length)],
            fileSize: rand(10, 50),
            whenAdded: 0,
        }
        randomState.incomingTasks.push(newTask);
    }




    //client 2,3,4 = random
    for (let i = 0; i < 50; i++) {
        let newTask = {
            client: rand(2, 5),
            fileName: lorem[rand(0, lorem.length)],
            fileSize: rand(10, 300),
            whenAdded: 0,
        }
        randomState.incomingTasks.push(newTask);
    }

    shuffleArray(randomState.incomingTasks);

    return randomState;


}

//  =============================================================== ui

var timerIds = [];

function onButtonStartClick() {
    console.log('start');
    let timerId = setInterval(() => {
        stepForward();
        updateInterface(state);
    }, 100);

    timerIds.push(timerId);

}

function onButtonStepClick(steps) {
    console.log('step ', steps);
    timerIds.forEach(clearInterval);
    if (steps > 0) {
        stepForward();
    }
    if (steps < 0) {
        stepBackwards();
    }
    updateInterface(state);
}

function onButtonPauseClick() {
    console.log('pause');
    timerIds.forEach(clearInterval);
    
    updateInterface(state);

}

function onButtonResetClick() {
    console.log('reset');
    timerIds.forEach(clearInterval);
    clearInterval(timerId);
    state = generateState;
    history = [state];
    updateInterface(state);
}
// 
function updateStateOfDrives(drives) {

    drives.forEach(drive => {
        let text = drive.runningTask ? taskAsHtml(drive.runningTask) : '(empty)';
        document.getElementById('d' + drive.id + '-task').innerHTML = text;
    })

}

function updateStateOfIncomingTasks(incomingTasks) {

    let text = '';

    incomingTasks.forEach(incomingTask => {
        text += taskAsHtml(incomingTask, taskAsColClasses);
    })

    document.getElementById('tasks-box').innerHTML = text;
    document.getElementById('inc-sub').innerHTML = ` (${incomingTasks.length})`;

}

function updateStateOfQueue(queue) {
    let text = '';

    queue.forEach(queueTask => {
        text += taskAsHtml(queueTask, taskAsColClasses);
    })

    document.getElementById('queue-box').innerHTML = text;
    document.getElementById('queue-sub').innerHTML = ` (${queue.length})`;

}

function updateStateOfNextTask(nextTask) {

    document.getElementById('next-task').innerHTML = taskAsHtml(nextTask, taskAsColClasses);
}

function updateStateOfClients(state) {
    state.clients.forEach(client => {

        let waiting = state.incomingTasks.filter(t => t.client === client.id);
        let inQueue = state.queue.filter(t => t.client === client.id);
        let nextTask = state.nextTask && state.nextTask.client == client.id ? state.nextTask : null;
        let inProgress = state.drives.filter(d => d.runningTask && d.runningTask.client == client.id).map(d => d.runningTask);
        let finished = state.finishedTasks.filter(t => t.client == client.id);

        let html = '';

        html += waiting.length > 0 ? 'waiting:<br>' : '';
        waiting.forEach(t => html += taskAsHtml(t));

        html += inQueue.length > 0 ? 'inQueue:<br>' : '';
        inQueue.forEach(t => html += taskAsHtml(t));

        html += nextTask ? 'nextTask:<br>' : '';
        html += nextTask ? taskAsHtml(nextTask) : '';

        html += inProgress.length > 0 ? 'inProgress:<br>' : '';
        inProgress.forEach(t => html += taskAsHtml(t));

        html += finished.length > 0 ? 'finished:<br>' : '';
        finished.forEach(t => html += taskAsHtml(t));



        document.getElementById(`client${client.id}-tasks`).innerHTML = html;

    })
}













// =========================================================================== drives
function executeTasksOnDrives(state) {
    state.drives.forEach(d => {
        if (d.runningTask) {
            //if task done, renmove
            if (d.runningTask.done >= d.runningTask.fileSize) {
                console.log(d.runningTask);
                console.log('task done');

                state.finishedTasks.push(d.runningTask);

                d.runningTask = null;
            } else {
                // increase task counter
                d.runningTask.done += 1;
            }
        }
    });
}

function getFirstFreeDrive(drives) {
    return drives.find(drive => drive.runningTask == null);
}





// =========================================================================== next task

function loadTaskIntoFirstFreeDrive(state) {
    let freeDrive = getFirstFreeDrive(state.drives);

    if (freeDrive && state.nextTask) {
        if (freeDrive.runningTask == null) {
            if (state.nextTask) {
                freeDrive.runningTask = state.nextTask;
                state.nextTask = null;
                freeDrive.runningTask.done = 0;
                if (verbose) console.log(`loaded task from client:${freeDrive.runningTask.client} into drive:${freeDrive.id}`)
            }
        }
    }


}





// =========================================================================== queue
function prepareHighestPriorityTask(state) {
    //  get task with highest prioroty
    let highestPriorityTask = getTaskWithHighestPriority(state.queue);
    if (highestPriorityTask) {
        // put this task in 'next task' box
        state.nextTask = highestPriorityTask;
        // remove this task from queue
        state.queue = state.queue.filter(task => task != highestPriorityTask);

        if (verbose) console.log(`task from client:${highestPriorityTask.client} set qas next task`);
    }

}

function getTaskWithHighestPriority(queue) {
    let maxPriority = 0;
    queue.forEach((queueTask, i, a) => {
        if (queueTask.priority > maxPriority || i == 0) {
            maxPriority = queueTask.priority;
        }
    });
    console.log('maxPriority : ' + maxPriority);
    return queue.find(queueTask => queueTask.priority == maxPriority);
}

function calculatePriority(state) {
    state.queue.forEach(queueTask => {
        queueTask.priority = calculateTaskPriority(state, queueTask);
    })
}

function calculateTaskPriority(state, queueTask) {
    return state.iteration - queueTask.whenAddedQueue;
}

function sortQueueBasedOnPriority(state) {
    calculatePriority(state);
    state.queue.sort((a, b) => {
        a.priority - b.priority;
    })
}

function loadTaskIntoQueue(state) {
    if (state.incomingTasks.length > 0) {
        let newQueueTasks = state.incomingTasks.filter(t => state.iteration >= t.whenAdded);
        newQueueTasks.forEach(newQueueTask => {
            if (verbose) console.log(`loading task from client:${newQueueTask.client} into queue`);
            newQueueTask.whenAddedQueue = state.iteration;
            newQueueTask.priority = null;

            state.queue.push(newQueueTask);

        });
        state.incomingTasks = state.incomingTasks.filter(t => !(state.iteration >= t.whenAdded));



    }
}

























function mainLoop(state) {
    // do tasks on hard drives
    executeTasksOnDrives(state)

    //load task from incoming into queue 
    loadTaskIntoQueue(state)

    // sort queue based on priority
    sortQueueBasedOnPriority(state);

    if (state.nextTask) {
        loadTaskIntoFirstFreeDrive(state);
        state.nextTask = null;
    } else {
        if (getFirstFreeDrive(state.drives)) {
            prepareHighestPriorityTask(state);
        }
    }
    return state;
}




function updateInterface(state) {
    document.getElementById('header').innerHTML = 'iteration: ' + state.iteration;
    updateStateOfDrives(state.drives);
    updateStateOfIncomingTasks(state.incomingTasks);
    updateStateOfQueue(state.queue);
    updateStateOfNextTask(state.nextTask);
    updateStateOfClients(state);
}





window.onload = () => {

    generatedState = generateState();


    state = generatedState;
    stateHistory = [state];

    console.log(state);

    updateInterface(state);


}




























const lorem = [
    "tempor",
    "aliquip",
    "eiusmod",
    "qui",
    "cillum",
    "ut",
    "consequat",
    "laborum",
    "officia",
    "irure",
    "veniam",
    "dolore",
    "aliquip",
    "in",
    "sunt",
    "pariatur",
    "consequat",
    "fugiat",
    "deserunt",
    "id",
    "enim",
    "nostrud",
    "qui",
    "laboris",
    "deserunt",
    "ullamco",
    "sit",
    "ex",
    "officia",
    "nisi",
    "do",
    "ullamco",
    "aliqua",
    "aliquip",
    "quis",
    "consequat",
    "consectetur",
    "aute",
    "culpa",
    "nostrud",
    "nostrud",
    "ea",
    "veniam",
    "duis",
    "excepteur",
    "anim",
    "culpa",
    "non",
    "minim",
    "amet",
    "ea",
    "enim",
    "pariatur",
    "officia",
    "consequat",
    "fugiat",
    "occaecat",
    "dolore",
    "labore",
    "duis",
    "labore",
    "exercitation",
    "sunt",
    "est",
    "ut",
    "cillum",
    "duis",
    "aliqua",
    "id",
    "laborum",
    "ipsum",
    "est",
    "voluptate",
    "ad",
    "ipsum",
    "laborum",
    "id",
    "aliquip",
    "reprehenderit",
    "elit",
    "fugiat",
    "ullamco",
    "qui",
    "dolore",
    "nostrud",
    "ut",
    "ad",
    "id",
    "ad",
    "eu",
    "ut",
    "irure",
    "minim",
    "ullamco",
    "id",
    "incididunt",
    "amet",
    "Lorem",
    "excepteur",
    "ex",
    "dolor",
    "do",
    "elit",
    "ad",
    "velit",
    "labore",
    "adipisicing",
    "nisi",
    "reprehenderit",
    "mollit",
    "ipsum",
    "magna",
    "velit",
    "nulla",
    "cillum",
    "adipisicing",
    "consequat",
    "anim",
    "commodo",
    "pariatur",
    "ut",
    "aliqua",
    "id",
    "excepteur",
    "consequat",
    "tempor",
    "veniam",
    "dolore",
    "in",
    "anim",
    "ipsum",
    "laboris",
    "quis",
    "mollit",
    "duis",
    "anim",
    "aute",
    "magna",
    "laborum",
    "Lorem",
    "consectetur",
    "ad",
    "in",
    "nisi",
    "reprehenderit",
    "amet",
    "qui",
    "mollit",
    "ex",
    "ad",
    "incididunt",
    "esse",
    "qui",
    "qui",
    "ipsum",
    "sunt",
    "minim",
    "ullamco",
    "esse",
    "elit",
    "velit",
    "laborum",
    "qui",
    "aute",
    "aliquip",
    "cillum",
    "magna",
    "reprehenderit",
    "irure",
    "mollit",
    "commodo",
    "laboris",
    "qui",
    "aliqua",
    "laborum",
    "incididunt",
    "et",
    "adipisicing",
    "tempor",
    "velit",
    "dolor",
    "deserunt",
    "pariatur",
    "dolor",
    "nisi",
    "reprehenderit",
    "magna",
    "enim",
    "nostrud",
    "sit",
    "veniam",
    "consequat",
    "Lorem",
    "et",
    "sunt",
    "nostrud",
    "id",
    "consequat",
    "aute",
    "elit",
    "officia",
    "est",
    "ad",
    "Lorem",
    "irure",
    "nulla",
    "labore",
    "ut",
    "irure",
    "exercitation",
    "irure",
    "reprehenderit",
    "enim",
    "irure",
    "occaecat",
    "Lorem",
    "quis",
    "dolor",
    "nulla",
    "sit",
    "officia",
    "aliqua",
    "adipisicing",
    "quis",
    "amet",
    "officia",
    "mollit",
    "esse",
    "eu",
    "excepteur",
    "irure",
    "laboris",
    "eiusmod",
    "occaecat",
    "cupidatat",
    "sunt",
    "sit",
    "dolore",
    "sint",
    "amet",
    "quis",
    "do",
    "ut",
    "ad",
    "voluptate",
    "dolore",
    "cillum",
    "ipsum",
    "tempor",
    "id"
]