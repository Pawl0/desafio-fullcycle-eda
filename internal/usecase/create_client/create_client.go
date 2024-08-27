package create_client

import (
	"fmt"
	"time"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/entity"
	"github.com.br/devfullcycle/fc-ms-wallet/internal/gateway"
)

type CreateClientInputDTO struct {
	Name  string
	Email string
}

type CreateClientOutputDTO struct {
	ID        string
	Name      string
	Email     string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type CreateClientUseCase struct {
	ClientGateway gateway.ClientGateway
}

func NewCreateClientUseCase(clientGateway gateway.ClientGateway) *CreateClientUseCase {
	return &CreateClientUseCase{
		ClientGateway: clientGateway,
	}
}

func (uc *CreateClientUseCase) Execute(input CreateClientInputDTO) (*CreateClientOutputDTO, error) {
	fmt.Println("CreateClientUseCase: ", input)
	client, err := entity.NewClient(input.Name, input.Email)
	if err != nil {
		return nil, err
	}
	fmt.Println("CreateClientUseCase client: ", client)
	err = uc.ClientGateway.Save(client)
	fmt.Println("CreateClientUseCase err: ", err)
	if err != nil {
		return nil, err
	}

	output := &CreateClientOutputDTO{
		ID:        client.ID,
		Name:      client.Name,
		Email:     client.Email,
		CreatedAt: client.CreatedAt,
		UpdatedAt: client.UpdatedAt,
	}
	fmt.Println("CreateClientUseCase output: ", output)
	return output, nil
}
