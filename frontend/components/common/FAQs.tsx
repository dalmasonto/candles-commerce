import { Accordion, Title } from '@mantine/core';
import { IconQuestionMark } from '@tabler/icons-react';
import React from 'react'

interface IFAQs {
    faqs?: any
}
const FAQs = (props: IFAQs) => {
    const { faqs } = props
    const items = faqs?.map((item: any, i: number) => (
        <Accordion.Item key={`faq_${i}`} value={`faq_${i}`} c={'white'}>
            <Accordion.Control icon={<IconQuestionMark color='white' />} c="white" className='no-bg-on-hover'>
                <Title order={4} c={'white'}>{item?.question}</Title>
            </Accordion.Control>
            <Accordion.Panel c={"white"}>{item?.answer}</Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <Accordion defaultValue={`faq_0`}>
            {items}
        </Accordion>
    );
}

export default FAQs