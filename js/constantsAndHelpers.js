const initialTasks = [
    {
        id: 0,
        name: "Visit Spain",
        description: "Visit Madrid, Barcelona. Also visit El Classico",
        priority: 1,
        isDone: true,
        deadline: "2023-10-13T17:27",
        category: "Travelling"
    },
    {
        id: 1,
        name: "Build PC",
        description: "Need more than $2000",
        priority: 3,
        isDone: false,
        deadline: "2022-11-01T18:00",
        category: "Hobby"
    },
    {
        id: 2,
        name: "Rent an apartment in Moscow",
        description: null,
        priority: 5,
        isDone: false,
        deadline: "2022-12-31T21:00",
        category: "Lifestyle"
    },
    {
        id: 3,
        name: "Buy a Monitor",
        description: null,
        priority: 2,
        isDone: true,
        deadline: "2022-09-30T21:00",
        category: "Hobby"
    },
    {
        id: 4,
        name: "Read the book",
        description: null,
        priority: 4,
        isDone: true,
        deadline: "2022-09-23T21:00",
        category: "Hobby"
    },
    {
        id: 5,
        name: "Meet with Gleb",
        description: null,
        priority: 2,
        isDone: true,
        deadline: "2022-08-23T21:00",
        category: "Lifestyle"
    }
]

const funcDebounce = function debounce(func, ms) {
    let timeout;

    return function () {
        const funcCall = () => {
            func.apply(this, arguments);
        }

        clearTimeout(timeout);
        timeout = setTimeout(funcCall, ms);
    }
}

const checkStrForEmpty = (str) => {
    if (str.replace(/ +?/g, "") !== "") return true;

    return false;
}