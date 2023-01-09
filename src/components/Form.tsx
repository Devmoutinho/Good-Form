import { Button, Center, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Text } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormData } from "../types/type";
import { useToast } from '@chakra-ui/react'
import { useRouter } from "next/router";
import { api } from "../api/api";
import { createdAt } from '../utils/showDate';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormCreateSchema } from "../validation/FormSchemaValidation";

export function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: yupResolver(FormCreateSchema) });
  const toast = useToast();
  const router = useRouter();

  const OnSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await new Promise((resolve) =>
        setTimeout(() => {
          createdAt();
          resolve(
            api.post("/form", {
              name: data.name,
              email: data.email,
              password: data.password,
              privacyTerms: data.privacyTerms,
              profession: data.profession,
              createdAt: createdAt(),
            })
          );
        }, 5000)
      );
      toast({
        title: "Registrado.",
        description: "Registro realizado com sucesso.",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });

      router.push("/list");
    } catch (error) {
      toast({
        title: "Erro de cadastro",
        status: "error",
        description: "Não foi possível fazer novo registro",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <Flex
      height="100%"
      flexDirection="column"
      justifyContent="center"
      align="center"
      px="2rem"
    >
      <Heading as="h2" mb="2rem" fontSize={["lg", "2xl"]}>
        Formulário React Hook Form
      </Heading>
      <FormControl minW={["15rem", "20rem"]} isInvalid={!!errors}>
        <FormLabel>Nome</FormLabel>
        <Input
          type="text"
          id="name"
          placeholder="Seu nome"
          {...register("name")}
        />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>

        <FormLabel mt="1rem">E-mail</FormLabel>
        <Input
          type="email"
          id="email"
          placeholder="Seu e-mail"
          {...register("email")}
        />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>

        <FormLabel mt="1rem">Senha</FormLabel>
        <Input
          type="password"
          id="password"
          placeholder="Sua senha"
          {...register("password")}
        />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>

        <FormLabel mt="1rem">Profissões</FormLabel>
        <Select
          defaultValue="0"
          {...register("profession")}
        >
          <option value="0">Selecione sua profissão...</option>
          <option value="Desenvolvedor">Desenvolvedor</option>
          <option value="Agilista">Agilista</option>
          <option value="QA">QA</option>
          <option value="Product Ower">Product Ower</option>
          <option value="Tech Leader">Tech Leader</option>
          <option value="Analista SEO">Analista SEO</option>
          <option value="Outros">Outros</option>
        </Select>

          <FormErrorMessage>{errors.profession?.message}</FormErrorMessage>

        <Checkbox
          mt="1rem"
          {...register("privacyTerms", {
            validate: (value) => value === true,
          })}
        >
          <Text fontSize={["smaller", "sm", "medium"]}>
            Eu concordo com os termos de privacidade
          </Text>
        </Checkbox>
        {errors.privacyTerms?.type === "validate" && (
          <FormErrorMessage>
            Você deve concordar com os termos de privacidade
          </FormErrorMessage>
        )}
        <Center mt="1.5rem">
          <Button
            colorScheme="blue"
            w="100%"
            onClick={() => handleSubmit(OnSubmit)()}
            isLoading={isSubmitting}
          >
            Registrar
          </Button>
        </Center>
      </FormControl>
    </Flex>
  );
}