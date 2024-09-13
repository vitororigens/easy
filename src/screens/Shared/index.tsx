import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { ButtonSelect, Container, Content, IconCheck, Title } from "./styles";
import { database } from "../../services";
import { FlatList } from "react-native";
import { ItemSharedUser } from "../../components/ItemSharedUser";
import { useEffect, useState } from "react";

export function Shared() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [sharedUsers, setSharedUsers] = useState<any[]>([]);

    const searchUsers = async (username: string) => {
        if (!username) {
            setSearchResults([]);
            return;
        }
        try {
            const userRef = database.collection('User');
            const snapshot = await userRef.where('userName', '==', username).get();
            if (!snapshot.empty) {
                const results = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        searchUsers(searchTerm);
    }, [searchTerm]);

    const addSharedUser = (user: any) => {
        if (sharedUsers.find(u => u.uid === user.uid)) return;
        setSharedUsers([...sharedUsers, user]);
        setSearchTerm("");
        setSearchResults([]);
    };

    return (
        <DefaultContainer title="Compartilhamento" backButton>
            <Container>
                <Input
                    name="search"
                    placeholder="Buscar usuários"
                    value={searchTerm}
                    onChangeText={(text) => setSearchTerm(text)}
                />

                {/* Renderizar o Content apenas quando houver termo de busca ou resultados */}
                {searchTerm.length > 0 && searchResults.length > 0 && (
                    <Content>
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.uid}
                            renderItem={({ item }) => {
                                const isChecked = !!sharedUsers.find(u => u.uid === item.uid);
                                return (
                                    <ButtonSelect onPress={() => addSharedUser(item)}>
                                        <Title type={isChecked ? 'PRIMARY' : 'SECONDARY'}>
                                            {item.userName}
                                        </Title>
                                        <IconCheck
                                            type={isChecked ? 'PRIMARY' : 'SECONDARY'}
                                            name={isChecked ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}
                                        />
                                    </ButtonSelect>
                                );
                            }}
                        />
                    </Content>
                )}

                {/* Renderizando os usuários compartilhados */}
                <FlatList
                    data={sharedUsers}
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => (
                        <ItemSharedUser
                            title={item.userName} 
                            span={"Compatilhando"}     
                            type="PRIMARY"       
                        />
                    )}
                />
            </Container>
        </DefaultContainer>
    );
}
