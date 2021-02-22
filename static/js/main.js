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
        item.onclick=()=>{
            let parent = item.closest('.news_detal'),
                block = parent.querySelector('.news_comment')
            if (block.style.display == "block")
                block.style.display = ""
            else
                block.style.display = "block";
        }
    })
}
catch{}

try{
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


    //Открыть и закрыть модальное окно
    let all_btn = document.querySelectorAll('.all_users'),
        add_btn = document.querySelectorAll('.add_user'),
        overlay = document.querySelector('.js-overlay-modal'),
        modal = document.querySelectorAll('.modal'),
        closeButton = document.querySelectorAll('.js-modal-close');

    all_btn.forEach((item)=>{
        item.onclick=(e)=>{
            getMembers(modal[0],e)
            modal[0].classList.add('add');
            overlay.classList.add('add');
            document.querySelector('body').style.overflowY="hidden"
        }; 
    })

    add_btn.forEach((item)=>{
        item.onclick=(e)=>{
            newMember(modal[1],e)
            modal[1].classList.add('add');
            overlay.classList.add('add');
            document.querySelector('body').style.overflowY="hidden"
        }; 
    })

    closeButton.forEach((item,i)=>{
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

    //Получение ссылки и очиска блока
    function preparationRequest(modal, event, move){
        let parent = event.target,
            block = parent.closest('.chat_detal'),
            form = block.querySelector(`.${move}`),
            action = form.name
        
        let items = modal.querySelectorAll('.modal__content p')
        if (items.length>0)
            items.forEach((item)=>{ item.remove() })

        return action

    }

    //Отправить запрос на получение списка участников беседы
    function getMembers(modal, event){
        let action = preparationRequest(modal, event, "members_list")
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
    function newMember(modal, event){
        let action = preparationRequest(modal, event, "members_add_list")
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
                    console.log(json)
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
                    console.log(json)
                    block.remove()
                })
            }
        })
    }
}
catch{}