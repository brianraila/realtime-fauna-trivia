import {Button} from '@chakra-ui/react'


export default function Answers({answers, question_id}){

    let submitAnswer = (answer, question_id) => {
        
    }


    return <>
    {answers && 
    answers.map((answer) => {
        return <Button variant="solid" 
            colorScheme="yellow"
            color="black"
            onClick={e=>{submitAnswer(answer.id, question_id)}}
            >{answer.text}</Button>
    })
    }
    </>

}