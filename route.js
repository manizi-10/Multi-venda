async function handler({
  name,
  email,
  phone,
  amount,
  paymentMethod,
  currency = "mzn",
}) {
  try {
    // Validação dos dados
    if (!name || name.trim().length < 3) {
      return {
        success: false,
        error: "Nome inválido",
      };
    }

    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Email inválido",
      };
    }

    if (!phone || phone.trim().length < 9) {
      return {
        success: false,
        error: "Telefone inválido",
      };
    }

    if (!amount || amount <= 0) {
      return {
        success: false,
        error: "Valor inválido",
      };
    }

    if (!paymentMethod) {
      return {
        success: false,
        error: "Método de pagamento não informado",
      };
    }

    // Gerar número único do pedido (ano + mês + 4 dígitos aleatórios)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `${year}${month}${randomDigits}`;

    // Criar objeto do pedido
    const order = {
      orderNumber,
      customer: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      },
      payment: {
        amount,
        currency,
        method: paymentMethod,
        status: "pending",
      },
      createdAt: date.toISOString(),
    };

    // Instruções de pagamento baseadas no método escolhido
    let paymentInstructions = "";
    switch (paymentMethod) {
      case "mpesa":
        paymentInstructions =
          "1. Acesse M-Pesa no seu celular\n2. Escolha 'Pagar Serviços'\n3. Use o número comerciante: XXXXX\n4. Digite o valor exato\n5. Use o número do pedido como referência";
        break;
      case "emola":
        paymentInstructions =
          "1. Abra o aplicativo e-mola\n2. Selecione 'Pagamentos'\n3. Use o número comerciante: XXXXX\n4. Digite o valor exato\n5. Use o número do pedido como referência";
        break;
      case "bank":
        paymentInstructions =
          "Faça uma transferência bancária para:\nBanco: XXXX\nConta: XXXX\nNIB: XXXX\nValor exato: " +
          amount +
          " " +
          currency +
          "\nReferência: " +
          orderNumber;
        break;
    }

    return {
      success: true,
      order: {
        number: orderNumber,
        amount: amount,
        currency: currency,
        status: "pending",
      },
      paymentInstructions,
      message:
        "Pedido registrado com sucesso! Use as instruções abaixo para efetuar o pagamento.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao processar pedido",
    };
  }
}