document.body.onload = () => {
    if(!sessionStorage.getItem('user')){
        // alert('You are not signed in')
        document.body.innerHTML = `
            Please, sign in to gain access to chats
    <a href='./signIn.html'><button>Sign In</button></a>

        `
    }
    document.querySelector('.welcome span').innerText = sessionStorage.getItem('user')

    var allUsers = JSON.parse(localStorage.getItem('users'))
    const me = allUsers.filter(user => user.username === sessionStorage.getItem('user'))[0]

    let find = document.querySelector('#find')


    //add to friends list
    function addToFriends(e){
        const btn = e.target
        const parent = btn.parentElement
        
        // get friend Name to add
        const friendName = parent.querySelector('.friendName').innerText
        
        //add Friend to friend list
        const allUsers = JSON.parse(localStorage.getItem('users'))
        console.log(allUsers)

        for(user of allUsers){
            if( user.username === sessionStorage.getItem('user')){
                user.friends.push(friendName)
            localStorage.setItem('users', JSON.stringify(allUsers))
            alert(friendName + ' added to friends list')
            window.location.reload()

            }
        }


    }


    find.onclick = () => {
        // clear finds
        
        const finds = document.querySelector('.finds')
        finds.innerHTML = ''
        // find all friends

        // find all users
        allUsers = JSON.parse(localStorage.getItem('users'))
        const usernames  = allUsers.map(user => user.username)

        // target current user
        
        
        // get all potential friends
        const potential = usernames.filter(user => !me.friends.includes(user))

        // reduce potential friends to a maximum of 10
        const maxSearch = potential.length < 5 ? potential.length : 5
        let potentialFriends = potential.slice(0, maxSearch).filter(name => !(name == me.username))
        
        
        // add all potential friends to dom
        potentialFriends.forEach(friend => {
            const div = document.createElement('div')
            div.innerHTML = `
                <div class="img">
                    <img src="./RunoStudent.PNG" alt="friend">
                </div>
                <div class="friendName">
                    ${friend}
                </div>
            `
            let btn = document.createElement('button')
            btn.classList.add('addFriend')
            btn.innerHTML = 'Add Friend'
            btn.onclick = addToFriends
            div.append(btn)
            finds.appendChild(div)
        })

        // show toggle button
        const toggleDisplay = document.querySelector('button.toggleDisplay')
        
        toggleDisplay.classList.toggle('hide');
        
    }

    

    //toggle add Friends display
    const toggleDisplay = document.querySelector('button.toggleDisplay')
    toggleDisplay.onclick = (e) => {
        const finds = document.querySelector('.finds')
        finds.classList.toggle('hide')
    }

   // view friend's status 
    const friends = document.querySelector('.friends')
    const myFriends = me.friends
    myFriends.forEach(friend => {
            const div = document.createElement('div')
            div.innerHTML = `
                <div class="img">
                    <img src="./RunoStudent.PNG" alt="friend">
                </div>
                <div class="friendsName">
                    ${friend}
                </div>
            `
            let btn = document.createElement('button')
            btn.classList.add('viewProfile')
            btn.innerHTML = 'view Profile'
            btn.onclick = viewProfile
            div.append(btn)
            friends.appendChild(div)
        })
    
    // view Friend's profile
    function viewProfile(e){
        
        // get Friend's info
        const parent = e.target.parentElement
        const friendsName = parent.querySelector('.friendsName').innerText
        
        //get friend's status
        allUsers.forEach(user => {
            if(user.username === friendsName){
                const status = user['status'] || `No status from ${friendsName} yet`

                
                const div = document.createElement('div')
                div.classList.add('friendsStatus')
                div.innerHTML = `
                <div class="img">
                    <img src="samuel1.png" alt="User image">
                </div>
                <div class="text">
                    ${status}
                </div>
                
                `
                button = document.createElement('button')
                button.classList.add('closeModal')
                button.innerText = 'Close'
                button.onclick = hideModal

                // show chat with friend
                if(!localStorage.getItem('chats')){
                    localStorage.setItem('chats', '[]')
                }

                // create a consistent chatName for every two chats
                // chats = [{chatName: user3_user4,  talks: [ [user3, Hello user4], [user4, hello user3] ]}]
                let chatName = me.username > user.username ? `${user.username}_${me.username}` : `${me.username}_${user.username}`
                let foundChat = null
                let convo = null
                let chats = JSON.parse(localStorage.getItem('chats'))
                for(let chat of chats){
                    if(chat.chatName === chatName){
                        foundChat = chats.indexOf(chat)
                        convo = chats[foundChat]
                        
                    }
                }
                // if chat exists
                if(convo){
                    messageDiv = document.createElement('div')
                    messageDiv.classList.add('chatHolder')
                    let talks = convo.talks
                    talks.forEach(talk => {
                        divChat = document.createElement('div')
                        let divClass =  talk[0] == me.username ? 'myMsg' : 'otherMsg'
                        divChat.classList.add(divClass)
                        divChat.innerHTML = `
                            <div>
                                ${talk[1]}
                            </div>
                        `
                        messageDiv.append(divChat)
                    })
                    div.append(messageDiv)



                }
                //else
                else{
                    // create convo and add to chats
                    convo = {
                        'chatName': chatName,
                        'talks': []
                    }
                    // chats[foundChat] = convo
                    chats.push(convo)
                    localStorage.setItem('chats', JSON.stringify(chats))
                    console.log(JSON.parse(localStorage.getItem('chats')))
                }


                // createMessage box
                const chatInput = document.createElement('input')
                chatInput.classList.add('chatInput')
                chatInput.placeholder = 'send a friendly hello';
                const chatButton = document.createElement('button')
                chatButton.innerText = 'sayHi'
                chatButton.classList.add('chatButton')

                // send Message 
                chatButton.onclick = (e) => {
                    text = document.querySelector('.chatInput').value
                    if(verifyText(text)){
                        let chatName = me.username > user.username ? `${user.username}_${me.username}` : `${me.username}_${user.username}`
                        let foundChat = null
                        let convo = null
                        let chats = JSON.parse(localStorage.getItem('chats'))
                        for(let chat of chats){
                            if(chat.chatName === chatName){
                                foundChat = chats.indexOf(chat)
                                convo = chats[foundChat]
                                
                            }
                        }
                        // if chat exists
                        if(convo){
                            let talks = convo.talks
                            let message =  [me.username, text]
                            convo.talks.push(message)
                            chats.push(convo)
                            localStorage.setItem('chats', JSON.stringify(chats))
                            console.log(JSON.parse(localStorage.getItem('chats')))

                        }
                        //else
                        else{
                            // create convo and add to chats
                            convo = {
                                'chatName': chatName,
                                'talks': [[me.username, text]]
                            }
                            // chats[foundChat] = convo
                            chats.push(convo)
                            localStorage.setItem('chats', JSON.stringify(chats))
                            console.log(JSON.parse(localStorage.getItem('chats')))
                        }

                        // append new message to chats
                        messageDiv = document.querySelector('.chatHolder') || document.createElement('div')
                        console.log(messageDiv.classList)
                        messageDiv.classList.add('chatHolder')
                        console.log(messageDiv)
                        //create Chat box

                        divChat = document.createElement('div')
                        let divClass =  'myMsg'
                        divChat.classList.add(divClass)
                        divChat.innerHTML = `
                            <div>
                                ${text}
                            </div>
                        `
                        messageDiv.append(divChat)
                        div.insertBefore(messageDiv, divForChat)
                        chatInput.value = ''
                        
                    }
                    else{
                        return
                    }
                }

                let divForChat = document.createElement('div')
                divForChat.appendChild(chatInput);
                divForChat.appendChild(chatButton);
                div.append(divForChat)

                div.append(button)
                document.body.insertBefore(div, friends)
            }
        })

    }
    function hideModal(e){
        const modalToHide = e.target.parentElement
        modalToHide.setAttribute('id', 'closeModal')
    }

    // update status
    
        const share = document.querySelector('#share')
        
        share.onclick = (e) => {
            // get message
            const text = document.querySelector('#bottom input').value
            if(verifyText(text)){
                updateStatus(text)

            }
            else{
                alert('Cannot share message. Kindly revisit')
            }
        }

        function verifyText(text){
            if(text.length < 2){
                return
            }
            const firstVal = text[0]
            let identical = true
            for(char of text){
                if(char !== firstVal){
                    identical = false
                }
            }
            return !identical
        }

        function updateStatus(text){
            const myUserName = me.username
            allUsers.forEach(user => {
                if(user.username === myUserName){
                    user['status'] = text
                    uploaded = JSON.stringify(new Date())
                    user['uploaded'] = uploaded
                    localStorage.setItem('users', JSON.stringify(allUsers))

                    alert('status Uploaded')
                    allUsers = JSON.parse(localStorage.getItem('users'))

                    console.log(allUsers)

                }
            })
        }
    
}