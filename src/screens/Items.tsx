import React from 'react';
import styled from 'styled-components';
import { groupBy, map } from 'lodash';
import { useAddToList, useItems } from '../firebase/data';
import { RouteComponentProps } from '@reach/router';
import { ifNotMobile, ifMobile, YELLOW } from '../utils/styles';
import IconButton from '../components/IconButton';
import { Item } from '../model/item';
import Spinner from '../components/Spinner';

export interface ItemsProps {
    currentListId?: string;
}


const ItemScreen = styled.div`
    padding-left: 13px;
    padding-right: 13px;
    ${ifNotMobile(`
        padding-left: 80px;
        padding-right: 80px;
    `)}
`;

const Title = styled.h1`
    font-size: 26px;
    margin-top: 40px;
    ${ifMobile(`display: none;`)}
`;

const SectionTitle = styled.p`
    margin-top: 40px;
    ${ifNotMobile(`margin-top: 60px;`)}
    margin-bottom: 18px;
    font-size: 18px;
    grid-column: 1 / -1;
`;

const Section = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(150px, max-content));
    grid-gap: 45px 20px;

    ${ifMobile(`
        grid-gap: 24px 9px;
    `)}

`;
const ItemElem = styled.div`
    padding: 18px 17px;
    background: white;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
`;

const ItemName = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
`;

const GrayIconButton = styled(IconButton)`
    opacity: 0.3;
    width: 16px;
    height: 16px;
`;

const Loading = styled.p`
    text-align: center;
    margin-top: 40px;
`;

const Error = styled.p`
    margin-top: 40px;
    color: red;
`;

const StyledSpinner = styled(Spinner)`
    opacity: 0.8;
`;


const Items: React.FunctionComponent<RouteComponentProps & ItemsProps> = ({ currentListId }) => {
    const { items, loading: fetchingItems, error: fetchItemsError } = useItems();
    const { addToList, itemBeingAdded, error: addItemError } = useAddToList();

    const itemsByCategory = groupBy(items, ((i: Item) => i.category));
    const handleAddClicked = (itemId: string) => () => currentListId && addToList(currentListId, itemId);

    return (
        <ItemScreen>
            <Title><span style={{ color: YELLOW }} >Shoppingify</span> allows you to take your shopping list wherever you go</Title>
            {fetchItemsError && <Error>error</Error>}
            {fetchingItems ? <Loading>Loading...</Loading> :
                map(itemsByCategory, (items: Item[], category: string) => (
                    <React.Fragment key={category}>

                        <Section>
                            <SectionTitle>{category}</SectionTitle>
                            {map(items, (item) => (
                                <ItemElem key={item.id}>
                                    <ItemName>{item.name}</ItemName>
                                    {itemBeingAdded === item.id ? <StyledSpinner /> : (
                                        <GrayIconButton src='add-24px.svg' alt='Add' onClick={handleAddClicked(item.id)} />
                                    )}
                                </ItemElem>))}
                        </Section>
                    </React.Fragment>
                ))}
        </ItemScreen>
    );
}

export default Items;