const mongoose = require("mongoose"),
    Memories = require("./models/memories"),
    Comment = require("./models/comment")


seeds = [
    {
        name: 'Championship with Shaq',
        image: 'https://specials-images.forbesimg.com/imageserve/5e2e9b97f133f400076abdfe/960x0.jpg?fit=scale',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget vehicula mi. Sed interdum dolor non turpis venenatis varius. In sed aliquet tellus. Curabitur porta erat non facilisis auctor. Aliquam malesuada sem non mollis venenatis. Mauris arcu dui, laoreet ac sollicitudin et, hendrerit vitae felis. Maecenas quis facilisis turpis. In sem tellus, rhoncus ac auctor eu, hendrerit ut diam. Ut et tristique erat. Sed dignissim dignissim ornare. Duis pellentesque dui ex, in ultricies tortor posuere non. Curabitur eget ipsum quis urna scelerisque tempor. Aenean nec viverra tortor, ac mollis neque. Donec non porttitor purus, ullamcorper elementum est. Sed blandit neque et lectus porttitor, ut laoreet sapien hendrerit.\n' +
            '\n' +
            'Mauris hendrerit ex eget odio consectetur finibus sed vitae urna. Duis id leo arcu. Nunc non malesuada purus. Nulla facilisi. Sed vel odio a metus finibus hendrerit eu sit amet turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean fermentum ut enim vitae sagittis. Sed convallis sem ac eleifend pulvinar. Curabitur ultrices justo eu sem ultrices, et egestas ligula elementum. Vivamus ac eros luctus, consectetur orci sed, hendrerit risus. Praesent vitae sollicitudin nisl, eget blandit ipsum. Nullam hendrerit a libero vel pharetra.\n' +
            '\n' +
            'Curabitur elit risus, elementum at congue sit amet, pretium in dolor. Donec bibendum arcu odio, nec' +
            ' condimentum eros fringilla a. Vestibulum sed purus elit. Quisque mattis tempus feugiat. Sed fringilla diam et metus tempor fringilla. Fusce nisl ligula, sollicitudin sit amet leo nec, fringilla tristique quam. Proin quis diam eget sem laoreet ornare. Morbi viverra turpis at quam consectetur tempus. Etiam mattis dolor lacinia quam euismod lacinia eu a est. Duis eget libero quis arcu varius volutpat.',
        author: {
            id: "5ecfdf2cb9acf31ac4664474",
            username: "Marc"
        }
    },
    {
        name: 'Kobe and Magic',
        image: 'https://clutchpoints.com/wp-content/uploads/2020/02/Magic-Johnson-shares-memories-of-Kobe-Bryant.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget vehicula mi. Sed interdum dolor non turpis venenatis varius. In sed aliquet tellus. Curabitur porta erat non facilisis auctor. Aliquam malesuada sem non mollis venenatis. Mauris arcu dui, laoreet ac sollicitudin et, hendrerit vitae felis. Maecenas quis facilisis turpis. In sem tellus, rhoncus ac auctor eu, hendrerit ut diam. Ut et tristique erat. Sed dignissim dignissim ornare. Duis pellentesque dui ex, in ultricies tortor posuere non. Curabitur eget ipsum quis urna scelerisque tempor. Aenean nec viverra tortor, ac mollis neque. Donec non porttitor purus, ullamcorper elementum est. Sed blandit neque et lectus porttitor, ut laoreet sapien hendrerit.\n' +
            '\n' +
            'Mauris hendrerit ex eget odio consectetur finibus sed vitae urna. Duis id leo arcu. Nunc non malesuada purus. Nulla facilisi. Sed vel odio a metus finibus hendrerit eu sit amet turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean fermentum ut enim vitae sagittis. Sed convallis sem ac eleifend pulvinar. Curabitur ultrices justo eu sem ultrices, et egestas ligula elementum. Vivamus ac eros luctus, consectetur orci sed, hendrerit risus. Praesent vitae sollicitudin nisl, eget blandit ipsum. Nullam hendrerit a libero vel pharetra.\n' +
            '\n' +
            'Curabitur elit risus, elementum at congue sit amet, pretium in dolor. Donec bibendum arcu odio, nec condimentum eros fringilla a. Vestibulum sed purus elit. Quisque mattis tempus feugiat. Sed fringilla diam et metus tempor fringilla. Fusce nisl ligula, sollicitudin sit amet leo nec, fringilla tristique quam. Proin quis diam eget sem laoreet ornare. Morbi viverra turpis at quam consectetur tempus. Etiam mattis dolor lacinia quam euismod lacinia eu a est. Duis eget libero quis arcu varius volutpat.',
        author: {
            id: "5ecfdf2cb9acf31ac4664474",
            username: "Marc"
        }
    }
]

async function seedDB() {
    try {
        await Memories.remove({})
        await Comment.remove({})
        console.log('All memories and comments removed')
        for (const seed of seeds) {
            let memory = await Memories.create(seed)
            console.log('Memory created')
            let comment = await Comment.create(
                {
                    text: "This is a test comment",
                    author: {
                        id: "5ecfdf2cb9acf31ac4664474",
                        username: "Marc"
                    }
                }
            )
            // 5ed51202fcb2000a205f53d8
            memory.comments.push(comment)
            memory.save()
            console.log('Memory saved.')
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = seedDB;
