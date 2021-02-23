//Увеличить размер текстового поля
function resize(item) {
  setTimeout(function() {
    item.style.cssText = 'height:auto;';
    item.style.cssText = 'height:' + item.scrollHeight + 'px';
  }, 1);
}

//Начать увеличивать резмер текстового поля при нажатии клавиши
let textareas = document.querySelectorAll('textarea');
textareas.forEach((item)=>{
    item.onkeydown=()=>{
        resize(item);
    }
})

try{
    //Открыть меню пользователя
    let user = document.querySelector(".user"),
        user_wrapper = user.querySelector(".user_wrapper")

    user.onclick=()=>{
        if (user_wrapper.style.display == "")
            user_wrapper.style.display = "flex"
        else
            user_wrapper.style.display = ""
    }
}catch{}



try{ //authenticate
    //Авторизация и регистрация
    let login = document.querySelector(".login"),
        reg = document.querySelector(".reg"),
        bts = document.querySelectorAll(".buttons button");

    bts[0].onclick=()=>{
        reg.style.display = "none"
        login.style.display = "block"
    }

    let login_form = login.querySelector('form');
    login_form.onsubmit=(e)=>{
        e.preventDefault();
        fetch(login_form.action, {
            method: "POST",
            body: new FormData(login_form),
        })
        .then(response => response.json())
        .then(function(json) { 
            console.log(json)
            if (json.success)
                window.location.href = json.success
            else{
                let error = json['errors']['__all__'][0],
                    block = login_form.querySelectorAll('p');
                block = block[block.length-1]
                block.insertAdjacentHTML("beforeend",`<ul><li class="error">${error}</li></ul>`);
            }
        })
    }

    bts[1].onclick=()=>{
        login.style.display = "none"
        reg.style.display = "block"
    }

    let reg_form = reg.querySelector('form');
    reg_form.onsubmit=(e)=>{
        e.preventDefault();
        fetch(reg_form.action, {
            method: "POST",
            body: new FormData(reg_form),
        })
        .then(response => response.json())
        .then(function(json) { 
            if (json.success)
                window.location.href = json.success
            else{
                if (json['errors']['email']){
                    let error = json['errors']['email'][0],
                        block = reg_form.querySelectorAll('p');
                    block = block[block.length-1]
                    block.insertAdjacentHTML("beforeend",`<ul><li class="error">${error}</li></ul>`);
                }
                if (json['errors']['password']){
                    let error = json['errors']['password'][0],
                        block = reg_form.querySelectorAll('p');
                    block = block[block.length-2]
                    block.insertAdjacentHTML("beforeend",`<ul><li class="error">${error}</li></ul>`); 
                }
            }
         })
    }
}catch{}



try{ //news + messenger
    //Показать форму выбора файла при нажатии на иконку
    let files = document.querySelectorAll('.fa-file-upload');
    files.forEach((item)=>{
        let parent = item.closest('form'),
            input = parent.querySelector('input[type=file]');
        item.onclick=()=>{
            if (input.style.display == "block")
                input.style.display = ""
            else
                input.style.display = "block";
        }
    })


    //Показать кнопку отправки
    let forms = document.querySelectorAll(".form");
    forms.forEach((item)=>{
        item.oninput=()=>{
            let btn = item.querySelector(".send"),
                input = item.querySelector("textarea"),
                file = item.querySelector("input[type=file]")
            if (input.value.length<1 && file.value == "")
                btn.style.display = ""
            else
                btn.style.display = "block"
        }
    })


    //Показать комментарии при нажатии на иконку
    let btn_comment = document.querySelectorAll('.comment_stats');
    btn_comment.forEach((item)=>{
        let count = item.querySelector('span').textContent
        if (count > 0){
            item.onclick=()=>{
                let parent = item.closest('.news_detal'),
                    block = parent.querySelector('.news_comment')
                if (block.style.display == "block")
                    block.style.display = ""
                else
                    block.style.display = "block";
            }
        }
    })
}
catch{}



try{ //messenger
    //Развернуть или свернуть чат
    let chats = document.querySelectorAll(".chat_new");
    chats.forEach((item)=>{
        item.onclick=()=>{
            let parent = item.closest('.chat_detal'),
                block = parent.querySelector('.chat_messages'),
                header = block.querySelector(".chat_header"),
                body = parent.querySelector(".chat_body"),
                chat_line = parent.querySelector(".chat_line");

            if (item.style.display == " "){
                item.style.display = "block"
                block.style.display = "none"
            }
            else{
                item.style.display = "none"
                block.style.display = "block"
                body.scrollTop = body.scrollHeight;
                chat_line.classList.add('chat_line_new')
                parent.classList.add('marginBottom-80')
            }
            header.onclick=()=>{
                if (block.style.display == " "){
                    item.style.display = "none"
                    block.style.display = "block"
                }
                else{
                    item.style.display = "block"
                    block.style.display = "none"
                    chat_line.classList.remove('chat_line_new')
                    parent.classList.remove('marginBottom-80')
                }
            }
        }
    })


    //Показать или свернуть меню чата
    let btn_menu = document.querySelectorAll('.fa-align-justify');
    btn_menu.forEach((item)=>{
        let parent = item.closest('.chat_detal'),
            block = parent.querySelector('.chat_menu');
            visibility = parent.querySelector('.visibility'),
            menu = parent.querySelector('.menu');
        item.onmouseover=()=>{
            block.style.display = "block"
        }
        visibility.onmouseleave=(e)=>{
            console.log(e.toElement === menu)
            console.log(menu)
            if (e.toElement == menu){
                menu.onmouseleave=(e)=>
                    block.style.display = "none"
            }
            else{
                block.style.display = "none"
            }
        }  
    })
}catch{}



try{ //messenger/chat/<slug>
    //Скролл чата в самый низ
    let body = document.querySelector(".chat_body");
    body.scrollTop = body.scrollHeight;


    //Открыть и закрыть модальное окно
    let list_members = document.querySelector('.all_users'),
        new_member = document.querySelector('.add_user'),
        overlay = document.querySelector('.js-overlay-modal'),
        modal = document.querySelectorAll('.modal'),
        closeButton = document.querySelectorAll('.js-modal-close');

    list_members.onclick=(e)=>{
        getMembers(e)
        modal[0].classList.add('add');
        overlay.classList.add('add');
        document.querySelector('body').style.overflowY="hidden"
    }; 

    new_member.onclick=(e)=>{
        newMember(e)
        modal[0].classList.add('add');
        overlay.classList.add('add');
        document.querySelector('body').style.overflowY="hidden"
    }; 

    closeButton.forEach((item)=>{
        item.onclick=()=>{
            modal[0].classList.remove('add');
            modal[1].classList.remove('add');
            overlay.classList.remove('add');
            document.querySelector('body').style.overflowY="auto"
        }; 
    })

    overlay.onclick=()=>{
        modal[0].classList.remove('add');
        modal[1].classList.remove('add');
        overlay.classList.remove('add');
        document.querySelector('body').style.overflowY="auto"
    };


    //Отправить запрос на получение списка участников беседы
    function getMembers(event){
        let modal = document.querySelector('.modal'),
            title = modal.querySelector('.modal__title');
        title.textContent = "Участники беседы:";
        //Получение ссылки на запрос
        let block = document.querySelector('.form-none'),
            form = block.querySelector('.members_list'),
            action = form.name
        //Очистка модального окна
        let items = modal.querySelectorAll('.modal__content p')
        if (items.length>0)
            items.forEach((item)=>{ item.remove() })
        //Отправка запроса и добавление результата
        fetch(action, {
            method: "GET",
        })
        .then(response => response.json())
        .then(function(json) { 
            if (json.name.length>=1){
                let block = modal.querySelector('.modal__content')
                for (let i=0; i<json.name.length; i++){
                    let content = `<p class="chat_user"><img src="${json.photo[i]}">
                    <span>${json.name[i]}</span>
                    <i class="fas fa-times"></i>
                    <input type="hidden" name=${json.id[i]}></p>`
                    block.insertAdjacentHTML("beforeend",content);
                }
                readyDeleteMember(event)
            }
        })
    }


    //Отправить запрос на получение списка участников для добавления
    function newMember(event){
        let modal = document.querySelector('.modal'),
            title = modal.querySelector('.modal__title');
        title.textContent = "Добавить участника:";
        //Получение ссылки на запрос
        let block = document.querySelector('.form-none'),
            form = block.querySelector('.members_add_list'),
            action = form.name
        //Очистка модального окна
        let items = modal.querySelectorAll('.modal__content p')
        if (items.length>0)
            items.forEach((item)=>{ item.remove() })
        fetch(action, {
            method: "GET",
        })
        .then(response => response.json())
        .then(function(json) { 
            let block = modal.querySelector('.modal__content')
            if (json.name.length>=1){
                for (let i=0; i<json.name.length; i++){
                    let content = `<p class="chat_user"><img src="${json.photo[i]}">
                        <span>${json.name[i]}</span>
                        <i class="fas fa-plus"></i>
                        <input type="hidden" name=${json.id[i]}></p>`
                    block.insertAdjacentHTML("beforeend",content);
                }
                readyAddMember(event)
            }
            else{
                let content = `<p class="fs-15">Пользователи для добавления в данную беседу отсутствуют</p>`
                block.insertAdjacentHTML("beforeend",content);  
            }
        })
    }


    //Удалить собеседника
    function readyDeleteMember(last_event){
        let del_btn = document.querySelectorAll(".fa-times")
        del_btn.forEach((item)=>{
            item.onclick=(e)=>{
                let parent = e.target,
                    block = parent.closest('.chat_user'),
                    user = block.querySelector('input').name;
                let last_parent = last_event.target,
                    chat = last_parent.closest('.chat_detal'),
                    form = chat.querySelector(`.remove_user`),
                    action = form.name;
                action = action.replace("0",user)
                fetch(action, {
                    method: "GET",
                })
                .then(response => response.json())
                .then(function(json) { 
                    block.remove()
                })
            }
        })
    }


    //Добавить собеседника
    function readyAddMember(last_event){
        let add_btn = document.querySelectorAll(".fa-plus")
        add_btn.forEach((item)=>{
            item.onclick=(e)=>{
                let parent = e.target,
                    block = parent.closest('.chat_user'),
                    user = block.querySelector('input').name;
                let last_parent = last_event.target,
                    chat = last_parent.closest('.chat_detal'),
                    form = chat.querySelector(`.new_user`),
                    action = form.name;
                action = action.replace("0",user)
                fetch(action, {
                    method: "GET",
                })
                .then(response => response.json())
                .then(function(json) { 
                    block.remove()
                })
            }
        })
    }
}
catch{}