'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FaultCodesDragQuiz from './FaultCodesDragQuiz'

const PASS_SCORE = 90

const sections = [
  { slug: 'basic', en: 'OTM Access & Daily Functions', es: 'Acceso OTM y Funciones Cotidianas', pt: 'Acesso OTM e Funções Cotidianas' },
  { slug: 'fault-codes', en: 'Fault Codes', es: 'Códigos de Falla', pt: 'Códigos de Falha' },
  { slug: 'freight-settlement', en: 'Freight Settlement', es: 'Liquidación de Flete', pt: 'Liquidação de Frete' },
  { slug: 'mfa', en: 'MFA Setup Guide', es: 'Guía de Configuración MFA', pt: 'Guia de Configuração MFA' },
]

const glossary = {
  en: [
    { term: 'Carrier', def: 'A transportation provider responsible for moving goods from one location to another. In OTM, carriers interact with shippers to receive and execute shipment tenders.' },
    { term: 'Shipment Tender', def: 'A formal request sent by the shipper (or OTM system) to a carrier, offering them the opportunity to transport goods. The carrier can accept or reject the tender based on availability and pricing.' },
    { term: 'Tender Acceptance/Rejection', def: 'The process by which a carrier accepts or rejects a shipment offer within OTM. Carriers are expected to respond promptly to ensure timely planning and execution.' },
    { term: 'Transportation Mode', def: 'The type of transportation used to move goods (e.g., road, rail, air, or sea). Carriers define the modes they support within OTM for specific routes or regions.' },
    { term: 'Accessorial Charges', def: 'Additional fees carriers charge for services beyond standard transportation, such as fuel surcharges, loading/unloading fees, or storage costs.' },
    { term: 'Service Level Agreement (SLA)', def: 'A contractual commitment between the shipper and carrier that defines expected performance standards, such as on-time delivery, transit times, and service quality.' },
    { term: 'Shipment Execution', def: 'The process where a carrier performs the transportation of goods as per the shipment tender. Includes pick-up, in-transit management, and delivery.' },
    { term: 'Status Update', def: 'Real-time updates provided by the carrier in OTM to inform the shipper about the current location or condition of the shipment.' },
    { term: 'Track and Trace', def: 'The process of monitoring the shipment\'s movement from origin to destination.' },
    { term: 'Compliance Management', def: 'Ensuring that the carrier meets all regulatory requirements, including safety certifications, insurance coverage, and driver qualifications.' },
    { term: 'Transport Document', def: 'A legal document provided by the carrier to the shipper, detailing the type, quantity, and destination of the goods being shipped.' },
    { term: 'Proof of Delivery (POD)', def: 'A document or electronic confirmation provided by the carrier once goods are delivered to the consignee. Used to confirm successful delivery, often required for payment.' },
    { term: 'Transportation Planning', def: 'The process within OTM that optimizes the selection of carriers, routes, and shipment schedules based on costs, service levels, and other factors.' },
    { term: 'Shipment ID', def: 'A unique identifier assigned to each shipment within OTM, used to track and manage all aspects of the shipment from tendering to final delivery.' },
    { term: 'Dock Scheduling', def: 'The process of scheduling and managing the arrival and departure of carriers at loading docks. OTM provides carriers with dock appointment schedules to minimize waiting times.' },
    { term: 'Transport Capacity', def: 'The total available space or resources (e.g., vehicles, containers) a carrier has for shipping goods.' },
    { term: 'Carrier Portal', def: 'An online platform in OTM where carriers can view and manage shipment tenders, update statuses, submit invoices, and communicate with shippers.' },
  ],
  es: [
    { term: 'Transportista', def: 'Proveedor de transporte responsable de mover mercancías de un lugar a otro. En OTM, los transportistas interactúan con los cargadores para recibir y ejecutar licitaciones de envío.' },
    { term: 'Licitación de Envío', def: 'Solicitud formal enviada por el cargador (o el sistema OTM) a un transportista, ofreciéndole la oportunidad de transportar mercancías.' },
    { term: 'Aceptación/Rechazo de Licitación', def: 'Proceso por el cual un transportista acepta o rechaza una oferta de envío en OTM. Se espera que los transportistas respondan con prontitud.' },
    { term: 'Modal de Transporte', def: 'Tipo de transporte utilizado para mover mercancías (ej. carretera, ferrocarril, aéreo o marítimo).' },
    { term: 'Cargos Adicionales', def: 'Tarifas adicionales que los transportistas cobran por servicios más allá del transporte estándar, como recargos de combustible o costos de almacenamiento.' },
    { term: 'Acuerdo de Nivel de Servicio (SLA)', def: 'Compromiso contractual entre el cargador y el transportista que define los estándares de desempeño esperados.' },
    { term: 'Ejecución de Envío', def: 'Proceso donde el transportista realiza el transporte de mercancías según la licitación. Incluye la recogida, gestión en tránsito y entrega.' },
    { term: 'Actualización de Estado', def: 'Actualizaciones en tiempo real proporcionadas por el transportista en OTM para informar al cargador sobre la ubicación o condición actual del envío.' },
    { term: 'Rastreo y Seguimiento', def: 'Proceso de monitoreo del movimiento del envío desde el origen hasta el destino.' },
    { term: 'Gestión de Cumplimiento', def: 'Garantizar que el transportista cumpla con todos los requisitos regulatorios, incluidas las certificaciones de seguridad y cobertura de seguro.' },
    { term: 'Documento de Transporte', def: 'Documento legal proporcionado por el transportista al cargador, detallando el tipo, cantidad y destino de las mercancías.' },
    { term: 'Prueba de Entrega (POD)', def: 'Documento o confirmación electrónica proporcionada por el transportista una vez que las mercancías son entregadas al consignatario.' },
    { term: 'Planificación de Transporte', def: 'Proceso dentro de OTM que optimiza la selección de transportistas, rutas y horarios de envío.' },
    { term: 'ID de Envío', def: 'Identificador único asignado a cada envío en OTM, utilizado para rastrear y gestionar todos los aspectos del envío.' },
    { term: 'Programación de Muelles', def: 'Proceso de programación y gestión de la llegada y salida de transportistas en los muelles de carga.' },
    { term: 'Capacidad de Transporte', def: 'Espacio total disponible o recursos que un transportista tiene para enviar mercancías.' },
    { term: 'Portal del Transportista', def: 'Plataforma en línea en OTM donde los transportistas pueden ver y gestionar licitaciones, actualizar estados y comunicarse con los cargadores.' },
  ],
  pt: [
    { term: 'Transportadora', def: 'Prestador de serviço de transporte responsável por mover mercadorias de um local para outro. No OTM, as transportadoras interagem com os embarcadores para receber e executar ofertas de frete.' },
    { term: 'Oferta de Frete', def: 'Solicitação formal enviada pelo embarcador (ou pelo sistema OTM) a uma transportadora, oferecendo a oportunidade de transportar mercadorias.' },
    { term: 'Aceitação/Rejeição de Oferta', def: 'Processo pelo qual uma transportadora aceita ou rejeita uma oferta de remessa no OTM. As transportadoras devem responder prontamente.' },
    { term: 'Modal de Transporte', def: 'Tipo de transporte usado para mover mercadorias (ex: rodoviário, ferroviário, aéreo ou marítimo).' },
    { term: 'Cobranças Adicionais', def: 'Taxas extras cobradas pelas transportadoras por serviços além do transporte padrão, como sobretaxas de combustível ou custos de armazenagem.' },
    { term: 'Acordo de Nível de Serviço (SLA)', def: 'Compromisso contratual entre o embarcador e a transportadora que define os padrões de desempenho esperados.' },
    { term: 'Execução de Remessa', def: 'Processo em que a transportadora realiza o transporte das mercadorias conforme a oferta de frete. Inclui coleta, gestão em trânsito e entrega.' },
    { term: 'Atualização de Status', def: 'Atualizações em tempo real fornecidas pela transportadora no OTM para informar o embarcador sobre a localização ou condição atual da remessa.' },
    { term: 'Rastreamento', def: 'Processo de monitoramento do movimento da remessa desde a origem até o destino.' },
    { term: 'Gestão de Conformidade', def: 'Garantir que a transportadora atenda a todos os requisitos regulatórios, incluindo certificações de segurança e cobertura de seguro.' },
    { term: 'Documento de Transporte', def: 'Documento legal fornecido pela transportadora ao embarcador, detalhando o tipo, quantidade e destino das mercadorias.' },
    { term: 'Comprovante de Entrega (POD)', def: 'Documento ou confirmação eletrônica fornecida pela transportadora após a entrega das mercadorias ao destinatário.' },
    { term: 'Planejamento de Transporte', def: 'Processo no OTM que otimiza a seleção de transportadoras, rotas e programações de remessa.' },
    { term: 'ID de Remessa', def: 'Identificador único atribuído a cada remessa no OTM, usado para rastrear e gerenciar todos os aspectos da remessa.' },
    { term: 'Agendamento de Docas', def: 'Processo de agendamento e gerenciamento da chegada e saída de transportadoras nas docas de carregamento.' },
    { term: 'Capacidade de Transporte', def: 'Espaço total disponível ou recursos que uma transportadora tem para enviar mercadorias.' },
    { term: 'Portal da Transportadora', def: 'Plataforma online no OTM onde as transportadoras podem visualizar e gerenciar ofertas de frete, atualizar status e se comunicar com os embarcadores.' },
  ]
}

const faultCodes = [
  { code: 'DA0000', level: 'Arrived on Time', en: 'System assigned for perfect orders', es: 'Asignado por el sistema para órdenes perfectas', pt: 'Atribuído pelo sistema para pedidos perfeitos' },
  { code: 'DAG101', level: 'Force Majeure', en: 'Arrival delayed due to any reason related to War, extreme weather, global pandemic, port strike and other such force majeurs', es: 'Llegada retrasada por razones relacionadas con guerra, clima extremo, pandemia global, huelga portuaria y otras causas de fuerza mayor', pt: 'Chegada atrasada por razões relacionadas a guerra, clima extremo, pandemia global, greve portuária e outras causas de força maior' },
  { code: 'DAT201', level: 'Late incoming transport', en: 'Carrier did not make the vehicle available on time at the origin for loading — vehicle arrived late to start the transport', es: 'El transportista no tuvo el vehículo disponible a tiempo en el origen para la carga — el vehículo llegó tarde para iniciar el transporte', pt: 'A transportadora não disponibilizou o veículo no horário na origem para carregamento — o veículo chegou atrasado para iniciar o transporte' },
  { code: 'DAT402', level: 'Equipment breakdown (truck, vessel, aircraft)', en: 'Shipment delayed due to mechanical failure or breakdown of the transport vehicle during the operation', es: 'Envío retrasado por falla mecánica o avería del vehículo de transporte durante la operación', pt: 'Remessa atrasada devido a falha mecânica ou pane do veículo de transporte durante a operação' },
  { code: 'DAT501', level: 'Traffic/Congestion', en: 'Delayed due to traffic', es: 'Retrasado debido al tráfico', pt: 'Atrasado devido ao tráfego' },
  { code: 'DAT502', level: 'Weather', en: 'Delayed due to severe/bad weather', es: 'Retrasado debido a clima severo/adverso', pt: 'Atrasado devido a clima severo/adverso' },
  { code: 'DAL101', level: 'Delayed Departure - See NOTD Fault Code', en: 'Arrival delayed at customer site because of delayed departure from factory', es: 'Llegada retrasada en el sitio del cliente debido a salida retrasada de la fábrica', pt: 'Chegada atrasada no local do cliente devido à saída atrasada da fábrica' },
  { code: 'DAA301', level: 'Production Quality Issue', en: 'Production Quality Issue', es: 'Problema de calidad de producción', pt: 'Problema de qualidade de produção' },
  { code: 'DAC302', level: 'Customer & TP agreement on new ETA - customer request', en: 'Customer initiates ETA Change Request and TP Agrees on new ETA', es: 'El cliente inicia una solicitud de cambio de ETA y TP acuerda la nueva ETA', pt: 'O cliente inicia uma solicitação de alteração de ETA e TP concorda com a nova ETA' },
  { code: 'DA9991', level: 'Missing ATA Entry', en: 'Arrival dates at OTM have not yet been entered. Please enter the arrival date in OTM immediately.', es: 'Las fechas de llegada en OTM aún no han sido ingresadas. Por favor, ingrese la fecha de llegada en OTM de inmediato.', pt: 'As datas de chegada no OTM ainda não foram inseridas. Por favor, insira a data de chegada no OTM imediatamente.' },
  { code: 'DA9993', level: 'Missing delay/anticipation reason', en: 'Arrival date was entered, but the reason for anticipation and/or delay was not included. Please enter the reason in OTM.', es: 'La fecha de llegada fue ingresada, pero no se incluyó el motivo de la anticipación y/o retraso. Por favor, ingréselo en OTM.', pt: 'A data de chegada foi inserida, mas o motivo da antecipação e/ou atraso não foi incluído. Por favor, insira o motivo no OTM.' },
]

const mfaSteps = {
  en: [
    { step: 1, title: 'Access the login URL', desc: 'Open your browser and go to the OTM login URL provided by your coordinator: https://otmgtm-a581693.otmgtm.eu-frankfurt-1.ocs.oraclecloud.com/' },
    { step: 2, title: 'First login screen', desc: 'On your first login attempt, you will see a QR code setup screen. This is where you will configure Multi-Factor Authentication (MFA).' },
    { step: 3, title: 'Download Oracle Mobile Authenticator', desc: 'Download the Oracle Mobile Authenticator app from your app store. Available for iOS (App Store) and Android (Google Play).' },
    { step: 4, title: 'Open Oracle Mobile Authenticator', desc: 'Once downloaded, open the Oracle Mobile Authenticator app on your mobile device.' },
    { step: 5, title: 'Scan the QR code', desc: 'Use the app to scan the QR code displayed on the OTM login page. This links your account to the authenticator app.' },
    { step: 6, title: 'Tap ADD', desc: 'After scanning, tap ADD in the app to confirm and add the account to your authenticator.' },
    { step: 7, title: 'Account confirmed', desc: 'You will receive a confirmation screen in the app indicating that the account has been successfully added.' },
    { step: 8, title: 'Access OTM again', desc: 'Return to the OTM login URL: https://otmgtm-a581693.otmgtm.eu-frankfurt-1.ocs.oraclecloud.com/ and enter your credentials.' },
    { step: 9, title: 'Approve the notification', desc: 'Check your mobile device — you will receive a push notification from Oracle Mobile Authenticator. Tap ALLOW to approve the login.' },
    { step: 10, title: 'Login complete', desc: 'After approving on your mobile, your laptop will confirm a successful login and you will be directed to the OTM dashboard.' },
    { step: 11, title: 'Changing your mobile device', desc: 'If you need to change your mobile device, contact your SCCT transportation analyst focal point to generate a ticket with the OTM support team.' },
  ],
  es: [
    { step: 1, title: 'Acceder a la URL de inicio de sesión', desc: 'Abra su navegador y vaya a la URL de inicio de sesión de OTM proporcionada por su coordinador: https://otmgtm-a581693.otmgtm.eu-frankfurt-1.ocs.oraclecloud.com/' },
    { step: 2, title: 'Pantalla de primer inicio de sesión', desc: 'En su primer intento de inicio de sesión, verá una pantalla de configuración con código QR. Aquí configurará la Autenticación Multifactor (MFA).' },
    { step: 3, title: 'Descargar Oracle Mobile Authenticator', desc: 'Descargue la aplicación Oracle Mobile Authenticator desde su tienda de aplicaciones. Disponible para iOS (App Store) y Android (Google Play).' },
    { step: 4, title: 'Abrir Oracle Mobile Authenticator', desc: 'Una vez descargada, abra la aplicación Oracle Mobile Authenticator en su dispositivo móvil.' },
    { step: 5, title: 'Escanear el código QR', desc: 'Use la aplicación para escanear el código QR que aparece en la página de inicio de sesión de OTM. Esto vincula su cuenta con la aplicación autenticadora.' },
    { step: 6, title: 'Hacer clic en AGREGAR', desc: 'Después de escanear, haga clic en AGREGAR en la aplicación para confirmar y agregar la cuenta a su autenticador.' },
    { step: 7, title: 'Cuenta confirmada', desc: 'Recibirá una pantalla de confirmación en la aplicación indicando que la cuenta se ha agregado exitosamente.' },
    { step: 8, title: 'Acceder nuevamente a OTM', desc: 'Regrese a la URL de inicio de sesión: https://otmgtm-a581693.otmgtm.eu-frankfurt-1.ocs.oraclecloud.com/ e ingrese sus credenciales.' },
    { step: 9, title: 'Aprobar la notificación', desc: 'Revise su dispositivo móvil — recibirá una notificación push de Oracle Mobile Authenticator. Haga clic en PERMITIR para aprobar el inicio de sesión.' },
    { step: 10, title: 'Inicio de sesión completado', desc: 'Después de aprobar en su móvil, su computadora confirmará el inicio de sesión exitoso y será dirigido al panel de OTM.' },
    { step: 11, title: 'Cambiar su dispositivo móvil', desc: 'Si necesita cambiar su dispositivo móvil, contacte a su analista de transporte focal point de SCCT para generar un ticket con el equipo de soporte OTM.' },
  ],
  pt: [
    { step: 1, title: 'Acessar a URL de login', desc: 'Abra seu navegador e acesse a URL de login do OTM fornecida pelo seu coordenador: https://otmgtm-a581693.otmgtm.eu-frankfurt-1.ocs.oraclecloud.com/' },
    { step: 2, title: 'Tela de primeiro login', desc: 'No seu primeiro acesso, você verá uma tela de configuração com código QR. É aqui que você configurará a Autenticação Multifator (MFA).' },
    { step: 3, title: 'Baixar Oracle Mobile Authenticator', desc: 'Baixe o aplicativo Oracle Mobile Authenticator na sua loja de aplicativos. Disponível para iOS (App Store) e Android (Google Play).' },
    { step: 4, title: 'Abrir Oracle Mobile Authenticator', desc: 'Após baixar, abra o aplicativo Oracle Mobile Authenticator no seu dispositivo móvel.' },
    { step: 5, title: 'Escanear o código QR', desc: 'Use o aplicativo para escanear o código QR exibido na página de login do OTM. Isso vincula sua conta ao aplicativo autenticador.' },
    { step: 6, title: 'Tocar em ADICIONAR', desc: 'Após escanear, toque em ADICIONAR no aplicativo para confirmar e adicionar a conta ao seu autenticador.' },
    { step: 7, title: 'Conta confirmada', desc: 'Você receberá uma tela de confirmação no aplicativo indicando que a conta foi adicionada com sucesso.' },
    { step: 8, title: 'Acessar o OTM novamente', desc: 'Retorne à URL de login: https://otmgtm-a581693.otmgtm.eu-frankfurt-1.ocs.oraclecloud.com/ e insira suas credenciais.' },
    { step: 9, title: 'Aprovar a notificação', desc: 'Verifique seu dispositivo móvel — você receberá uma notificação push do Oracle Mobile Authenticator. Toque em PERMITIR para aprovar o login.' },
    { step: 10, title: 'Login concluído', desc: 'Após aprovar no celular, seu computador confirmará o login bem-sucedido e você será direcionado ao painel do OTM.' },
    { step: 11, title: 'Trocar seu dispositivo móvel', desc: 'Se precisar trocar seu dispositivo móvil, entre em contato com seu analista de transporte focal point do SCCT para gerar um ticket com a equipe de suporte OTM.' },
  ]
}

const modules = {
  basic: [
    { id:1, video:null, en:{title:"Introduction",tag:"Module 1",desc:"Overview of the OTM training objectives, scope, and glossary.",content:`<h3>Objective</h3><p>The objective of this training is to efficiently manage relationships, performance, and interactions with carriers to ensure reliable, cost-effective, and timely transportation services across the supply chain.</p><h3>Scope</h3><ul><li>Overview of OTM and its role in logistics and transportation</li><li>Understanding key functionalities that transportation providers use in OTM</li><li>Receiving and managing shipment tenders</li><li>Shipment execution and status updates</li><li>Carrier collaboration with shippers</li><li>Compliance and risk management</li></ul><h3>Training Tips</h3><ul><li>Focus on details: review each section thoroughly before moving on</li><li>Take notes: jot down key points or questions during the training</li><li>Revisit sections: go back to any part if something is not clear</li></ul>`,quiz:[{q:"What is the primary objective of this OTM training?",options:["To learn how to code logistics software","To efficiently manage relationships, performance, and interactions with carriers","To replace the need for a transportation coordinator","To reduce the number of shipments processed"],correct:1},{q:"Which of the following is covered in the training scope?",options:["Financial auditing of carriers","Compliance and risk management","Warehouse construction","HR management for drivers"],correct:1}]}, es:{title:"Introducción",tag:"Módulo 1",desc:"Descripción general de los objetivos, alcance y glosario de la capacitación OTM.",content:`<h3>Objetivo</h3><p>El objetivo de esta capacitación es gestionar de manera eficiente las relaciones, el rendimiento y las interacciones con los transportistas para garantizar servicios de transporte confiables, rentables y oportunos.</p><h3>Alcance</h3><ul><li>Descripción general de OTM y su rol en logística y transporte</li><li>Comprensión de las funcionalidades clave</li><li>Recepción y gestión de licitaciones de envío</li><li>Ejecución de envíos y actualizaciones de estado</li><li>Colaboración del transportista con los cargadores</li><li>Cumplimiento y gestión de riesgos</li></ul><h3>Consejos de capacitación</h3><ul><li>Enfócate en los detalles: revisa cada sección antes de continuar</li><li>Toma notas: anota puntos clave durante la capacitación</li><li>Revisita secciones: vuelve a cualquier parte si algo no está claro</li></ul>`,quiz:[{q:"¿Cuál es el objetivo principal de esta capacitación OTM?",options:["Aprender a programar software logístico","Gestionar eficientemente las relaciones, el rendimiento y las interacciones con los transportistas","Reemplazar la necesidad de un coordinador de transporte","Reducir el número de envíos procesados"],correct:1},{q:"¿Cuál de los siguientes temas está incluido en el alcance?",options:["Auditoría financiera de transportistas","Cumplimiento y gestión de riesgos","Construcción de almacenes","Gestión de recursos humanos"],correct:1}]}, pt:{title:"Introdução",tag:"Módulo 1",desc:"Visão geral dos objetivos, escopo e glossário do treinamento OTM.",content:`<h3>Objetivo</h3><p>O objetivo deste treinamento é gerenciar com eficiência os relacionamentos, o desempenho e as interações com transportadoras para garantir serviços de transporte confiáveis, econômicos e pontuais.</p><h3>Escopo</h3><ul><li>Visão geral do OTM e seu papel na logística</li><li>Funcionalidades principais usadas pelos prestadores de serviço</li><li>Recebimento e gestão de ofertas de frete</li><li>Execução de remessas e atualizações de status</li><li>Colaboração com embarcadores</li><li>Conformidade e gestão de riscos</li></ul><h3>Dicas de treinamento</h3><ul><li>Foque nos detalhes: revise cada seção antes de avançar</li><li>Faça anotações: registre pontos-chave durante o treinamento</li><li>Revisite seções: volte a qualquer parte se algo não estiver claro</li></ul>`,quiz:[{q:"Qual é o principal objetivo deste treinamento OTM?",options:["Aprender a programar software de logística","Gerenciar com eficiência os relacionamentos, desempenho e interações com transportadoras","Substituir a necessidade de um coordenador de transporte","Reduzir o número de remessas processadas"],correct:1},{q:"Qual dos seguintes tópicos está incluído no escopo?",options:["Auditoria financeira de transportadoras","Conformidade e gestão de riscos","Construção de armazéns","Gestão de RH para motoristas"],correct:1}]} },
    { id:2, video:"https://wnypubltm64soaxh.public.blob.vercel-storage.com/module2.mp4", en:{title:"OTM Introduction",tag:"Module 2",desc:"User login, authentication, and dashboard overview.",content:`<h3>User Login and Authentication</h3><p>Access to OTM is provided through your assigned credentials. Carriers must use only their authorized accounts and avoid sharing passwords with unauthorized team members.</p><h3>Dashboard Overview</h3><ul><li>View active and upcoming shipment tenders</li><li>Monitor shipment status and progress</li><li>Access communication tools and notifications</li><li>Manage transport documents and POD</li><li>Check pickup appointment schedules</li></ul>`,quiz:[{q:"What should carriers avoid regarding their OTM login credentials?",options:["Using a strong password","Logging in daily","Sharing passwords with drivers or subcontractors","Updating their profile"],correct:2},{q:"Which of the following can be accessed from the OTM dashboard?",options:["Social media integration","Active shipment tenders and pickup appointment queries","Weather forecasting tools","Tax filing services"],correct:1}]}, es:{title:"Introducción a OTM",tag:"Módulo 2",desc:"Inicio de sesión, autenticación y descripción general del panel de control.",content:`<h3>Inicio de sesión y autenticación</h3><p>El acceso a OTM se proporciona mediante las credenciales asignadas. Los transportistas deben usar únicamente sus cuentas autorizadas y evitar compartir contraseñas.</p><h3>Panel de control</h3><ul><li>Ver licitaciones de envío activas y próximas</li><li>Monitorear el estado y progreso de los envíos</li><li>Acceder a herramientas de comunicación y notificaciones</li><li>Gestionar documentos de transporte y POD</li><li>Verificar horarios y citas de recolección</li></ul>`,quiz:[{q:"¿Qué deben evitar los transportistas respecto a sus credenciales?",options:["Usar una contraseña segura","Iniciar sesión diariamente","Compartir contraseñas con conductores o subcontratistas","Actualizar su perfil"],correct:2},{q:"¿A qué se puede acceder desde el panel de control?",options:["Integración con redes sociales","Licitaciones activas y consultas sobre citas de recolección","Herramientas de pronóstico del tiempo","Servicios de declaración de impuestos"],correct:1}]}, pt:{title:"Introdução ao OTM",tag:"Módulo 2",desc:"Login, autenticação e visão geral do painel de controle.",content:`<h3>Login e autenticação</h3><p>O acesso ao OTM é fornecido por meio de credenciais atribuídas. As transportadoras devem usar apenas suas contas autorizadas e evitar compartilhar senhas.</p><h3>Painel de controle</h3><ul><li>Ver ofertas de frete ativas e futuras</li><li>Monitorar o status das remessas</li><li>Acessar ferramentas de comunicação e notificações</li><li>Gerenciar documentos de transporte e POD</li><li>Verificar agendamentos de coleta</li></ul>`,quiz:[{q:"O que as transportadoras devem evitar em relação às credenciais do OTM?",options:["Usar uma senha forte","Fazer login diariamente","Compartilhar senhas com motoristas ou subcontratados","Atualizar seu perfil"],correct:2},{q:"O que pode ser acessado pelo painel do OTM?",options:["Integração com redes sociais","Ofertas de frete ativas e consultas sobre os agendamentos de coleta","Ferramentas de previsão do tempo","Serviços de declaração de impostos"],correct:1}]} },
    { id:3, video:"https://wnypubltm64soaxh.public.blob.vercel-storage.com/module3.mp4", en:{title:"Shipment Tendering",tag:"Module 3",desc:"Understanding tenders, acceptance, rejection, spot bids, and negotiation.",content:`<h3>What is a Tender?</h3><p>A shipment tender is a formal request sent by the shipper to a carrier through OTM. Key elements include shipment details, pickup and delivery information, transportation mode, cost and rates, and a tender deadline.</p><h3>Acceptance and Rejection</h3><p>When a carrier accepts a tender, they agree to pick up and deliver the shipment on time. Carriers may reject for valid reasons:</p><ul><li>Capacity constraints: insufficient vehicles for the requested time windows</li><li>Rate disagreement: proposed rate does not meet expectations</li><li>Special handling: inability to manage specific requirements</li></ul><h3>Spot Bids and Negotiation</h3><p>When standard tenders are not accepted, OTM supports spot bidding and negotiation processes.</p>`,quiz:[{q:"What is a shipment tender in OTM?",options:["A delivery confirmation document","A formal request sent to a carrier to transport goods","A payment invoice for completed shipments","A dock scheduling tool"],correct:1},{q:"What does OTM support when standard tenders are not accepted?",options:["Automatic cancellation","Spot bidding and negotiation","Mandatory acceptance","Legal proceedings"],correct:1}]}, es:{title:"Licitación de Envíos",tag:"Módulo 3",desc:"Comprensión de licitaciones, aceptación, rechazo y negociación.",content:`<h3>¿Qué es una licitación?</h3><p>Una licitación de envío es una solicitud formal enviada por el cargador a un transportista a través de OTM. Los elementos clave incluyen detalles del envío, información de recogida y entrega, modal, tarifas y plazo de respuesta.</p><h3>Aceptación y rechazo</h3><ul><li>Restricciones de capacidad</li><li>Desacuerdo en tarifas</li><li>Manejo especial requerido</li></ul><h3>Ofertas spot y negociación</h3><p>Cuando no se aceptan las licitaciones estándar, OTM admite procesos de negociación.</p>`,quiz:[{q:"¿Qué es una licitación de envío en OTM?",options:["Un documento de confirmación de entrega","Una solicitud formal enviada a un transportista para transportar mercancías","Una factura de pago","Una herramienta de programación de muelles"],correct:1},{q:"¿Qué admite OTM cuando no se aceptan las licitaciones estándar?",options:["Cancelación automática","Ofertas spot y negociación","Aceptación obligatoria","Procedimientos legales"],correct:1}]}, pt:{title:"Oferta de Frete",tag:"Módulo 3",desc:"Entendimento de ofertas, aceitação, rejeição e negociação.",content:`<h3>O que é uma oferta de frete?</h3><p>Uma oferta de frete é uma solicitação formal enviada pelo embarcador a uma transportadora pelo OTM. Os elementos principais incluem detalhes da remessa, informações de coleta e entrega, modal, tarifas e prazo de resposta.</p><h3>Aceitação e rejeição</h3><ul><li>Restrições de capacidade</li><li>Desacordo sobre tarifas</li><li>Requisitos especiais de manuseio</li></ul><h3>Licitações spot e negociação</h3><p>Quando as ofertas padrão não são aceitas, o OTM suporta processos de negociação.</p>`,quiz:[{q:"O que é uma oferta de frete no OTM?",options:["Um documento de confirmação de entrega","Uma solicitação formal enviada a uma transportadora para transportar mercadorias","Uma fatura de pagamento","Uma ferramenta de agendamento de docas"],correct:1},{q:"O que o OTM suporta quando as ofertas padrão não são aceitas?",options:["Cancelamento automático","Licitações spot e negociação","Aceitação obrigatória","Procedimentos legais"],correct:1}]} },
    { id:4, video:"https://wnypubltm64soaxh.public.blob.vercel-storage.com/appt_detail.mp4", en:{title:"Dock & Yard Management",tag:"Module 4",desc:"Understanding your pickup window and how to check your appointment in OTM.",content:`<h3>Pickup Window</h3><p>Your pickup window is defined by the SCCT team. You will be notified by email with your scheduled time. You can also verify your appointment directly in OTM on the <strong>Shipments All</strong> screen, where all relevant scheduling details are available.</p><p>The video above shows exactly where to find your appointment information in the system.</p>`,quiz:[{q:"How will carriers be notified of their pickup window?",options:["By phone call from the warehouse","By email from the SCCT team","Through a notification in the OTM mobile app","By checking the OTM dashboard daily"],correct:1},{q:"Where can carriers verify their appointment schedule in OTM?",options:["In the Carrier Portal settings","On the Shipments All screen","In the Document Management section","In the ATA Updates tab"],correct:1}]}, es:{title:"Gestión de Muelles y Patio",tag:"Módulo 4",desc:"Comprensión de tu ventana de recolección y cómo verificar tu cita en OTM.",content:`<h3>Ventana de Recolección</h3><p>Tu ventana de recolección es definida por el equipo de SCCT. Serás notificado por correo electrónico con tu horario programado. También puedes verificar tu cita directamente en OTM en la pantalla <strong>Shipments All</strong>, donde están disponibles todos los detalles de programación relevantes.</p><p>El video anterior muestra exactamente dónde encontrar la información de tu cita en el sistema.</p>`,quiz:[{q:"¿Cómo serán notificados los transportistas de su ventana de recolección?",options:["Por llamada telefónica del almacén","Por correo electrónico del equipo de SCCT","A través de una notificación en la app móvil de OTM","Verificando el panel de OTM diariamente"],correct:1},{q:"¿Dónde pueden verificar los transportistas su horario de cita en OTM?",options:["En la configuración del Portal del Transportista","En la pantalla Shipments All","En la sección de Gestión de Documentos","En la pestaña de Actualizaciones ATA"],correct:1}]}, pt:{title:"Gestão de Docas e Pátio",tag:"Módulo 4",desc:"Entendendo sua janela de coleta e como verificar seu agendamento no OTM.",content:`<h3>Janela de Coleta</h3><p>Sua janela de coleta é definida pela equipe do SCCT. Você será notificado por e-mail com seu horário agendado. Você também pode verificar seu agendamento diretamente no OTM na tela <strong>Shipments All</strong>, onde todos os detalhes de agendamento relevantes estão disponíveis.</p><p>O vídeo acima mostra exatamente onde encontrar as informações do seu agendamento no sistema.</p>`,quiz:[{q:"Como as transportadoras serão notificadas sobre sua janela de coleta?",options:["Por ligação telefônica do armazém","Por e-mail da equipe do SCCT","Por uma notificação no app móvel do OTM","Verificando o painel do OTM diariamente"],correct:1},{q:"Onde as transportadoras podem verificar seu agendamento no OTM?",options:["Nas configurações do Portal da Transportadora","Na tela Shipments All","Na seção de Gestão de Documentos","Na aba de Atualizações de ATA"],correct:1}]} },
    { id:5, video:null, en:{title:"Dock Changes & Rescheduling",tag:"Module 5",desc:"What to do when you cannot meet a scheduled pickup window.",content:`<h3>Changes and Rescheduling</h3><p>If you are unable to meet a scheduled pickup window, it is essential to notify the SCCT team <strong>at least 24 hours in advance</strong>. Early communication allows the team to review and adjust your schedule, avoiding disruptions to warehouse operations.</p><h3>How to Communicate</h3><p>Contact the SCCT transportation team directly to report any inability to meet your window or to request a schedule change. Do not wait — proactive communication is key to maintaining a smooth operation for all parties involved.</p>`,quiz:[{q:"How far in advance must SCCT be notified if a carrier cannot meet a pickup window?",options:["At least 1 hour before","At least 24 hours in advance","At least 48 hours in advance","Only on the day of the pickup"],correct:1},{q:"How should a carrier communicate a schedule change or inability to meet a pickup window?",options:["By updating OTM independently without contacting anyone","By contacting the SCCT transportation team directly","By sending an email to the warehouse dock","By waiting for SCCT to contact them first"],correct:1}]}, es:{title:"Cambios y Reprogramación de Muelles",tag:"Módulo 5",desc:"Qué hacer cuando no puedes cumplir una ventana de recolección programada.",content:`<h3>Cambios y Reprogramación</h3><p>Si no puedes cumplir una ventana de recolección programada, es fundamental notificar al equipo de SCCT con <strong>al menos 24 horas de anticipación</strong>. La comunicación temprana permite al equipo revisar y ajustar tu horario, evitando interrupciones en las operaciones del almacén.</p><h3>Cómo Comunicarse</h3><p>Contacta directamente al equipo de transporte de SCCT para reportar cualquier imposibilidad de cumplir tu ventana o para solicitar un cambio de horario. No esperes — la comunicación proactiva es clave para mantener una operación fluida para todas las partes involucradas.</p>`,quiz:[{q:"¿Con cuánta anticipación debe notificarse a SCCT si un transportista no puede cumplir una ventana de recolección?",options:["Al menos 1 hora antes","Al menos 24 horas de anticipación","Al menos 48 horas de anticipación","Solo el día de la recolección"],correct:1},{q:"¿Cómo debe comunicar un transportista un cambio de horario o la imposibilidad de cumplir una ventana de recolección?",options:["Actualizando OTM de forma independiente sin contactar a nadie","Contactando directamente al equipo de transporte de SCCT","Enviando un correo al muelle del almacén","Esperando a que SCCT los contacte primero"],correct:1}]}, pt:{title:"Alterações e Reagendamento de Docas",tag:"Módulo 5",desc:"O que fazer quando não é possível cumprir uma janela de coleta agendada.",content:`<h3>Alterações e Reagendamento</h3><p>Se não for possível cumprir uma janela de coleta agendada, é essencial notificar a equipe do SCCT com <strong>pelo menos 24 horas de antecedência</strong>. A comunicação antecipada permite que a equipe revise e ajuste seu horário, evitando interrupções nas operações do armazém.</p><h3>Como Comunicar</h3><p>Entre em contato diretamente com a equipe de transporte do SCCT para reportar qualquer impossibilidade de cumprir sua janela ou para solicitar uma alteração de horário. Não espere — a comunicação proativa é fundamental para manter uma operação tranquila para todas as partes envolvidas.</p>`,quiz:[{q:"Com quanto de antecedência a SCCT deve ser notificada se uma transportadora não puder cumprir uma janela de coleta?",options:["Pelo menos 1 hora antes","Pelo menos 24 horas de antecedência","Pelo menos 48 horas de antecedência","Apenas no dia da coleta"],correct:1},{q:"Como uma transportadora deve comunicar uma alteração de horário ou impossibilidade de cumprir uma janela de coleta?",options:["Atualizando o OTM de forma independente sem contatar ninguém","Entrando em contato diretamente com a equipe de transporte do SCCT","Enviando um e-mail para a doca do armazém","Aguardando a SCCT entrar em contato primeiro"],correct:1}]} },
    { id:6, video:"https://wnypubltm64soaxh.public.blob.vercel-storage.com/module6.mp4", en:{title:"Shipment Execution",tag:"Module 6",desc:"Information updates, real-time tracking, and status updates.",content:`<h3>Information Updates</h3><p>Capturing and communicating all relevant shipment events throughout the transportation lifecycle.</p><ul><li>Real-time status capture: pickup, in-transit events, customs clearance, delivery, and POD</li><li>Exception reporting: delays, route changes, damage reports, or failed delivery attempts</li><li>Compliance and documentation: updating transport documents to reflect the latest shipment events</li><li>Stakeholder communication: providing carriers, customers, and planning units with timely updates</li></ul><h3>Tracking and Status Updates</h3><p>Monitoring shipment progress and communicating accurate, timely information as goods move from origin to destination.</p><ul><li>Movement Tracking: monitoring real-time location updates and transit milestones via GPS or carrier updates</li><li>Status Event Reporting: recording pickup, loading, customs release, departure, arrival, unloading, delivery, and POD confirmation</li><li>Exception Management: logging delays, route deviations, damages, or failed delivery attempts</li><li>Visibility for Stakeholders: providing transparent tracking information to carriers, planners, and customer service</li></ul>`,quiz:[{q:"Which of the following must a carrier report as an exception in OTM?",options:["A shipment delivered on time","A route change or failed delivery attempt","A new dock appointment confirmed in advance","A tender accepted within the deadline"],correct:1},{q:"Which statuses must be captured in real time during shipment execution?",options:["Only the final delivery status","Pickup, in-transit events, customs clearance, delivery, and POD","Only delays and damages","Only the departure status"],correct:1}]}, es:{title:"Ejecución de Envíos",tag:"Módulo 6",desc:"Actualizaciones de información, rastreo en tiempo real y actualizaciones de estado.",content:`<h3>Actualizaciones de información</h3><p>Captura y comunicación de todos los eventos relevantes durante el ciclo de vida del transporte.</p><ul><li>Captura de estado en tiempo real: recogida, eventos en tránsito, despacho de aduanas, entrega y POD</li><li>Reporte de excepciones: retrasos, cambios de ruta, informes de daños o intentos fallidos</li><li>Cumplimiento y documentación: actualización de documentos de transporte</li><li>Comunicación con partes interesadas: actualizaciones oportunas a todos los involucrados</li></ul><h3>Rastreo y actualizaciones de estado</h3><ul><li>Rastreo de movimiento: actualizaciones de ubicación en tiempo real mediante GPS</li><li>Reporte de eventos: registro de recogida, carga, despacho, salida, llegada, descarga, entrega y POD</li><li>Gestión de excepciones: registro de retrasos, desviaciones de ruta y daños</li><li>Visibilidad para partes interesadas: información de rastreo transparente</li></ul>`,quiz:[{q:"¿Cuál debe reportar un transportista como excepción en OTM?",options:["Un envío entregado a tiempo","Un cambio de ruta o intento fallido de entrega","Una nueva cita de muelle confirmada","Una licitación aceptada dentro del plazo"],correct:1},{q:"¿Qué estados deben capturarse en tiempo real?",options:["Solo el estado de entrega final","Recogida, eventos en tránsito, despacho de aduanas, entrega y POD","Solo retrasos y daños","Solo el estado de salida"],correct:1}]}, pt:{title:"Execução de Remessas",tag:"Módulo 6",desc:"Atualizações de informações, rastreamento em tempo real e atualizações de status.",content:`<h3>Atualizações de informações</h3><p>Captura e comunicação de todos os eventos relevantes durante o ciclo de vida do transporte.</p><ul><li>Captura de status em tempo real: coleta, eventos em trânsito, despacho aduaneiro, entrega e POD</li><li>Relatório de exceções: atrasos, mudanças de rota, relatórios de danos ou tentativas fracassadas</li><li>Conformidade e documentação: atualização de documentos de transporte</li><li>Comunicação com partes interessadas: atualizações oportunas a todos os envolvidos</li></ul><h3>Rastreamento e atualizações de status</h3><ul><li>Rastreamento de movimento: atualizações de localização em tempo real via GPS</li><li>Relatório de eventos: registro de coleta, carregamento, liberação aduaneira, saída, chegada, descarregamento, entrega e POD</li><li>Gestão de exceções: registro de atrasos, desvios de rota e danos</li><li>Visibilidade para partes interessadas: informações de rastreamento transparentes</li></ul>`,quiz:[{q:"O que uma transportadora deve reportar como exceção no OTM?",options:["Uma remessa entregue no prazo","Uma mudança de rota ou tentativa de entrega fracassada","Um novo agendamento de doca confirmado","Uma oferta aceita dentro do prazo"],correct:1},{q:"Quais status devem ser capturados em tempo real?",options:["Apenas o status de entrega final","Coleta, eventos em trânsito, despacho aduaneiro, entrega e POD","Apenas atrasos e danos","Apenas o status de saída"],correct:1}]} },
    { id:7, video:"https://wnypubltm64soaxh.public.blob.vercel-storage.com/module7.mp4", en:{title:"ATA Updates & Fault Codes",tag:"Module 7",desc:"Recording actual arrival times and capturing execution-related issues.",content:`<h3>ATA Updates</h3><p>ATA (Actual Time of Arrival) updates ensure accurate arrival times are recorded promptly, keeping planned and actual timelines aligned and supporting KPIs like transit performance and OTIF.</p><ul><li>ATA must be entered as soon as the truck arrives at the facility</li><li>Late or missing ATA entries affect dock planning and downstream operations</li><li>ATA data feeds into carrier performance metrics and KPI reporting</li></ul><h3>Fault Codes</h3><p>Fault codes capture issues during shipment execution, enabling structured identification of disruptions.</p><ul><li>Delays caused by traffic, weather, or mechanical failure</li><li>Equipment failures such as refrigeration or loading issues</li><li>Missing or incorrect documentation</li><li>Missed scans or system transmission errors</li></ul>`,quiz:[{q:"What does ATA stand for in the context of OTM?",options:["Automated Tracking Alert","Actual Time of Arrival","Advanced Transport Assignment","Authorized Tender Acceptance"],correct:1},{q:"What is the purpose of fault codes in OTM?",options:["To rate carrier performance monthly","To identify and record disruptions such as delays, equipment failures, or missing documents","To generate invoices automatically","To plan new transportation routes"],correct:1}]}, es:{title:"Actualizaciones ATA y Códigos de Falla",tag:"Módulo 7",desc:"Registro de tiempos reales de llegada y captura de problemas de ejecución.",content:`<h3>Actualizaciones ATA</h3><p>Las actualizaciones ATA garantizan que los tiempos de llegada reales se registren con prontitud, apoyando KPIs como el rendimiento de tránsito y OTIF.</p><ul><li>El ATA debe ingresarse en cuanto el camión llega a las instalaciones</li><li>Las entradas tardías afectan la planificación de muelles y operaciones posteriores</li><li>Los datos de ATA alimentan las métricas de rendimiento y los reportes de KPI</li></ul><h3>Códigos de Falla</h3><ul><li>Retrasos por tráfico, clima o falla mecánica</li><li>Fallas de equipos como refrigeración</li><li>Documentación faltante o incorrecta</li><li>Escaneos perdidos o errores de transmisión</li></ul>`,quiz:[{q:"¿Qué significa ATA en el contexto de OTM?",options:["Alerta de Rastreo Automatizado","Tiempo Real de Llegada","Asignación de Transporte Avanzado","Aceptación de Licitación Autorizada"],correct:1},{q:"¿Cuál es el propósito de los códigos de falla?",options:["Calificar el rendimiento mensualmente","Identificar y registrar interrupciones como retrasos, fallas de equipos o documentos faltantes","Generar facturas automáticamente","Planificar nuevas rutas"],correct:1}]}, pt:{title:"Atualizações de ATA e Códigos de Falha",tag:"Módulo 7",desc:"Registro de horários reais de chegada e captura de problemas de execução.",content:`<h3>Atualizações de ATA</h3><p>As atualizações de ATA garantem que os horários sejam registrados prontamente, mantendo os cronogramas alinhados e apoiando KPIs como desempenho de trânsito e OTIF.</p><ul><li>O ATA deve ser inserido assim que o caminhão chegar às instalações</li><li>Entradas tardias afetam o planejamento de docas e operações posteriores</li><li>Os dados de ATA alimentam as métricas de desempenho e relatórios de KPI</li></ul><h3>Códigos de Falha</h3><ul><li>Atrasos por tráfego, clima ou falha mecânica</li><li>Falhas de equipamentos como refrigeração</li><li>Documentação faltante ou incorreta</li><li>Scans perdidos ou erros de transmissão</li></ul>`,quiz:[{q:"O que significa ATA no contexto do OTM?",options:["Alerta de Rastreamento Automático","Horário Real de Chegada","Atribuição de Transporte Avançado","Aceitação de Oferta Autorizada"],correct:1},{q:"Qual é o propósito dos códigos de falha?",options:["Avaliar o desempenho mensal","Identificar e registrar interrupções como atrasos, falhas de equipamentos ou documentos faltantes","Gerar faturas automaticamente","Planejar novas rotas"],correct:1}]} },
    { id:8, video:"https://wnypubltm64soaxh.public.blob.vercel-storage.com/module10.mp4", en:{title:"Document Management",tag:"Module 8",desc:"Transport document and POD upload — ensuring proper documentation, compliance, and traceability.",content:`<h3>Document Upload</h3><p>Document Management focuses on capturing and uploading essential transportation documents to ensure proper documentation flow, compliance, and traceability.</p><ul><li>Transport Document: documents shipment details such as shipper, consignee, cargo description, and transport conditions — serving as both a receipt and a legal contract</li><li>Proof of Delivery (POD): confirms that goods have been successfully delivered, including signatures, timestamps, and condition notes</li><li>Document accuracy: uploaded files must match the actual shipment and contain all required fields</li><li>Traceability: documents stored digitally support claims, disputes, and compliance audits</li><li>Faster response: timely POD upload allows quick proof of delivery to respond to customer demands efficiently</li><li>Reduces manual errors: digitizing document handling replaces paper-based exchanges</li></ul>`,quiz:[{q:"Which document confirms that goods have been successfully delivered, including signatures and timestamps?",options:["The shipment tender","The Proof of Delivery (POD)","The dock booking confirmation","The ATA update"],correct:1},{q:"What is the main reason for uploading the POD promptly in OTM?",options:["To trigger a new shipment tender","To provide quick proof of delivery and respond to customer demands efficiently","To generate ATA fault codes","To create new shipment tenders automatically"],correct:1}]}, es:{title:"Gestión de Documentos",tag:"Módulo 8",desc:"Carga de documento de transporte y POD — garantizando documentación adecuada, cumplimiento y trazabilidad.",content:`<h3>Carga de documentos</h3><p>La Gestión de Documentos se enfoca en capturar y cargar documentos esenciales para garantizar un flujo adecuado, cumplimiento y trazabilidad.</p><ul><li>Documento de Transporte: documenta los detalles del envío — sirve como recibo y contrato legal</li><li>Prueba de entrega (POD): confirma la entrega exitosa, incluyendo firmas y marcas de tiempo</li><li>Precisión de documentos: los archivos deben coincidir con el envío real</li><li>Trazabilidad: documentos digitales apoyan reclamaciones y auditorías</li><li>Respuesta ágil: la carga oportuna del POD permite atender demandas del cliente eficientemente</li><li>Reduce errores manuales: la digitalización reemplaza los intercambios en papel</li></ul>`,quiz:[{q:"¿Qué documento confirma la entrega exitosa, incluyendo firmas y marcas de tiempo?",options:["La licitación de envío","La Prueba de Entrega (POD)","La confirmación de reserva de muelle","La actualización ATA"],correct:1},{q:"¿Cuál es la razón principal para cargar el POD con prontitud?",options:["Para activar una nueva licitación","Para tener el comprobante de entrega de forma ágil y atender las demandas del cliente","Para generar códigos de falla ATA","Para crear automáticamente nuevas licitaciones"],correct:1}]}, pt:{title:"Gestão de Documentos",tag:"Módulo 8",desc:"Upload de documento de transporte e POD — garantindo documentação adequada, conformidade e rastreabilidade.",content:`<h3>Upload de documentos</h3><p>A Gestão de Documentos foca na captura e upload de documentos essenciais para garantir fluxo adequado, conformidade e rastreabilidade.</p><ul><li>Documento de Transporte: documenta os detalhes da remessa — serve como recibo e contrato legal</li><li>Comprovante de entrega (POD): confirma a entrega bem-sucedida, incluindo assinaturas e carimbos de tempo</li><li>Precisão dos documentos: os arquivos devem corresponder à remessa real</li><li>Rastreabilidade: documentos digitais suportam reclamações e auditorias</li><li>Resposta ágil: o upload oportuno do POD permite atender demandas do cliente eficientemente</li><li>Reduz erros manuais: a digitalização substitui trocas em papel</li></ul>`,quiz:[{q:"Qual documento confirma a entrega bem-sucedida, incluindo assinaturas e carimbos de tempo?",options:["A oferta de frete","O Comprovante de Entrega (POD)","A confirmação de agendamento de doca","A atualização de ATA"],correct:1},{q:"Qual é o principal motivo para fazer o upload do POD prontamente?",options:["Para acionar uma nova oferta de frete","Para ter comprovante de entrega de forma ágil e atender demandas do cliente","Para gerar códigos de falha ATA","Para criar novas ofertas automaticamente"],correct:1}]} },
    { id:9, video:"https://wnypubltm64soaxh.public.blob.vercel-storage.com/module8.mp4", en:{title:"Communication Management",tag:"Module 9",desc:"OTM Chats and notifications for efficient, traceable collaboration.",content:`<h3>OTM Chats</h3><p>OTM Chats facilitates efficient and traceable communication directly within OTM, centralizing discussions around specific shipments or events.</p><ul><li>Real-time communication tied to specific shipments or execution events</li><li>Context-linked messaging: comment directly within a shipment record</li><li>Traceable communication history: valuable for audits and dispute resolution</li><li>Reduces fragmentation across emails, calls, or external messaging tools</li></ul><h3>OTM Notifications</h3><ul><li>Event-based alerts: tender sent/accepted, pickup confirmed, delivery, and POD captured</li><li>Exception notifications: delays, missed appointments, capacity shortfalls, route deviations</li><li>Audience targeting: ensuring the right users receive relevant alerts</li><li>Multi-channel delivery: in-app, email, or integrated webhooks</li><li>Configurable rules and thresholds matching business priorities</li></ul>`,quiz:[{q:"What is a key advantage of OTM Chats over external messaging tools?",options:["It is faster to type","It centralizes shipment-linked conversations and maintains a traceable communication history","It allows anonymous messaging","It replaces the need for shipment tenders"],correct:1},{q:"Which type of notification alerts carriers about delays or missed appointments?",options:["Event-based alerts","Exception notifications","Financial alerts","Login notifications"],correct:1}]}, es:{title:"Gestión de Comunicación",tag:"Módulo 9",desc:"Chats y notificaciones de OTM para una colaboración eficiente y trazable.",content:`<h3>Chats de OTM</h3><p>Los Chats de OTM facilitan la comunicación eficiente y trazable dentro de OTM, centralizando las discusiones alrededor de envíos específicos.</p><ul><li>Comunicación en tiempo real vinculada a envíos específicos</li><li>Mensajería vinculada al contexto del envío</li><li>Historial de comunicación trazable para auditorías</li><li>Reduce la fragmentación entre correos y herramientas externas</li></ul><h3>Notificaciones de OTM</h3><ul><li>Alertas basadas en eventos: licitación enviada/aceptada, recogida confirmada, entrega</li><li>Notificaciones de excepciones: retrasos, citas perdidas, desviaciones de ruta</li><li>Segmentación de audiencia: alertas relevantes para los usuarios correctos</li><li>Entrega multicanal: en la aplicación, correo electrónico o webhooks</li><li>Reglas y umbrales configurables</li></ul>`,quiz:[{q:"¿Cuál es una ventaja clave de los Chats de OTM?",options:["Es más rápido escribir","Centraliza las conversaciones vinculadas a envíos y mantiene un historial trazable","Permite mensajes anónimos","Reemplaza la necesidad de licitaciones"],correct:1},{q:"¿Qué tipo de notificación alerta sobre retrasos o citas perdidas?",options:["Alertas basadas en eventos","Notificaciones de excepciones","Alertas financieras","Notificaciones de inicio de sesión"],correct:1}]}, pt:{title:"Gestão de Comunicação",tag:"Módulo 9",desc:"Chats e notificações do OTM para colaboração eficiente e rastreável.",content:`<h3>Chats do OTM</h3><p>Os Chats do OTM facilitam comunicação eficiente e rastreável diretamente no OTM, centralizando discussões em torno de remessas específicas.</p><ul><li>Comunicação em tempo real vinculada a remessas específicas</li><li>Mensagens vinculadas ao contexto da remessa</li><li>Histórico de comunicação rastreável para auditorias</li><li>Reduz fragmentação entre e-mails e ferramentas externas</li></ul><h3>Notificações do OTM</h3><ul><li>Alertas baseados em eventos: oferta enviada/aceita, coleta confirmada, entrega</li><li>Notificações de exceções: atrasos, agendamentos perdidos, desvios de rota</li><li>Segmentação de audiência: alertas relevantes para os usuários certos</li><li>Entrega multicanal: no app, e-mail ou webhooks</li><li>Regras e limites configuráveis</li></ul>`,quiz:[{q:"Qual é a principal vantagem dos Chats do OTM?",options:["É mais rápido digitar","Centraliza conversas vinculadas a remessas e mantém histórico rastreável","Permite mensagens anônimas","Substitui a necessidade de ofertas de frete"],correct:1},{q:"Qual tipo de notificação alerta sobre atrasos ou agendamentos perdidos?",options:["Alertas baseados em eventos","Notificações de exceções","Alertas financeiros","Notificações de login"],correct:1}]} },
    { id:10, video:null, en:{title:"Compliance & Security",tag:"Module 10",desc:"Data protection best practices and secure usage of OTM.",content:`<h3>Protect Data</h3><p>Carriers must use OTM in a secure, compliant, and responsible way, protecting shipment data, documents, and communications shared through the platform.</p><ul><li>Use only authorized OTM credentials — do not share passwords with unauthorized team members</li><li>Respect role-based visibility — access only shipments and data relevant to you</li><li>Handle documents (transport documents, POD, invoices) accurately and completely</li><li>Use OTM Chats safely — avoid sharing personal data or financial details</li><li>Verify information before uploading to prevent data inconsistencies</li><li>Log out after completing tasks, especially on shared or on-the-road devices</li><li>Report any system issues or suspicious activity immediately to your SCCT transportation analyst focal point</li><li>Follow document retention and deletion practices based on contractual and compliance requirements</li></ul>`,quiz:[{q:"What should carriers do after completing their tasks in OTM on shared devices?",options:["Leave the session open","Log out to prevent unauthorized access","Delete all shipment records","Transfer credentials to a colleague"],correct:1},{q:"What should a carrier do if they notice suspicious activity in OTM?",options:["Ignore it and continue working","Try to resolve it independently","Report it immediately to the SCCT transportation analyst focal point","Share the issue on external messaging platforms"],correct:2}]}, es:{title:"Cumplimiento y Seguridad",tag:"Módulo 10",desc:"Mejores prácticas de protección de datos y uso seguro de OTM.",content:`<h3>Proteger los datos</h3><p>Los transportistas deben usar OTM de manera segura, conforme y responsable, protegiendo los datos de envío y comunicaciones compartidas.</p><ul><li>Use solo las credenciales de OTM autorizadas — no comparta contraseñas</li><li>Respete la visibilidad basada en roles</li><li>Maneje los documentos (documentos de transporte, POD, facturas) con precisión</li><li>Use los Chats de OTM de forma segura</li><li>Verifique la información antes de cargarla</li><li>Cierre sesión después de completar sus tareas en dispositivos compartidos</li><li>Reporte cualquier actividad sospechosa a su analista de transporte focal point de SCCT</li><li>Siga las prácticas de retención y eliminación de documentos</li></ul>`,quiz:[{q:"¿Qué deben hacer los transportistas después de completar sus tareas en dispositivos compartidos?",options:["Dejar la sesión abierta","Cerrar sesión para evitar accesos no autorizados","Eliminar todos los registros de envío","Transferir credenciales a un colega"],correct:1},{q:"¿Qué debe hacer un transportista si nota actividad sospechosa en OTM?",options:["Ignorarlo y continuar trabajando","Intentar resolverlo de forma independiente","Reportarlo de inmediato al analista de transporte focal point de SCCT","Compartir el problema en plataformas externas"],correct:2}]}, pt:{title:"Conformidade e Segurança",tag:"Módulo 10",desc:"Boas práticas de proteção de dados e uso seguro do OTM.",content:`<h3>Proteger os dados</h3><p>As transportadoras devem usar o OTM de forma segura, em conformidade e responsável, protegendo dados de remessa e comunicações compartilhadas.</p><ul><li>Use apenas credenciais autorizadas — não compartilhe senhas</li><li>Respeite a visibilidade baseada em função</li><li>Gerencie documentos (documentos de transporte, POD, faturas) com precisão</li><li>Use os Chats do OTM com segurança</li><li>Verifique as informações antes de fazer upload</li><li>Faça logout após concluir tarefas em dispositivos compartilhados</li><li>Reporte qualquer atividade suspeita ao seu analista de transporte focal point do SCCT</li><li>Siga as práticas de retenção e exclusão de documentos</li></ul>`,quiz:[{q:"O que as transportadoras devem fazer após concluir tarefas em dispositivos compartilhados?",options:["Deixar a sessão aberta","Fazer logout para evitar acesso não autorizado","Excluir todos os registros de remessa","Transferir credenciais para um colega"],correct:1},{q:"O que uma transportadora deve fazer se notar atividade suspeita?",options:["Ignorar e continuar trabalhando","Tentar resolver de forma independente","Reportar imediatamente ao analista de transporte focal point do SCCT","Compartilhar o problema em plataformas externas"],correct:2}]} },
  ],
  'fault-codes': [
    { id:1, video:null,
      en:{title:"Fault Codes Reference",tag:"Module 1",desc:"Complete list of OTM fault codes, their categories, and descriptions.",
        content:`<h3>What are Fault Codes?</h3><p>Fault codes are used in OTM to record the reason for arrival delays or deviations. Selecting the correct code ensures accurate reporting, supports KPI tracking, and helps identify recurring issues in the supply chain.</p><h3>Important Codes</h3><p>DA9991: If this code appears, arrival dates at OTM have not yet been entered. Please enter the arrival date in OTM immediately.</p><p>DA9993: If this code appears, the arrival date was entered but the reason for anticipation and/or delay was not included. Please enter it in OTM.</p>`,
        quiz:[{q:"What does fault code DA9991 indicate?",options:["The shipment was delivered on time","The arrival dates at OTM have not yet been entered","There was a vehicle breakdown","The weather caused a delay"],correct:1},{q:"What should you do when fault code DA9993 appears?",options:["Ignore it and continue","Enter the reason for anticipation and/or delay in OTM","Cancel the shipment","Contact the warehouse team"],correct:1}]},
      es:{title:"Referencia de Códigos de Falla",tag:"Módulo 1",desc:"Lista completa de códigos de falla de OTM, sus categorías y descripciones.",
        content:`<h3>¿Qué son los Códigos de Falla?</h3><p>Los códigos de falla se usan en OTM para registrar el motivo de los retrasos o desviaciones en la llegada. Seleccionar el código correcto garantiza informes precisos, apoya el seguimiento de KPI y ayuda a identificar problemas recurrentes.</p><h3>Códigos Importantes</h3><p>DA9991: Si aparece este código, significa que las fechas de llegada en OTM aún no han sido ingresadas. Por favor, ingréselas de inmediato.</p><p>DA9993: Si aparece este código, la fecha de llegada fue ingresada pero no se incluyó el motivo de la anticipación y/o retraso. Por favor, ingréselo en OTM.</p>`,
        quiz:[{q:"¿Qué indica el código de falla DA9991?",options:["El envío fue entregado a tiempo","Las fechas de llegada en OTM aún no han sido ingresadas","Hubo una avería del vehículo","El clima causó un retraso"],correct:1},{q:"¿Qué debe hacer cuando aparece el código DA9993?",options:["Ignorarlo y continuar","Ingresar el motivo de la anticipación y/o retraso en OTM","Cancelar el envío","Contactar al equipo del almacén"],correct:1}]},
      pt:{title:"Referência de Códigos de Falha",tag:"Módulo 1",desc:"Lista completa de códigos de falha do OTM, suas categorias e descrições.",
        content:`<h3>O que são Códigos de Falha?</h3><p>Os códigos de falha são usados no OTM para registrar o motivo de atrasos ou desvios na chegada. Selecionar o código correto garante relatórios precisos, suporta o rastreamento de KPIs e ajuda a identificar problemas recorrentes.</p><h3>Códigos Importantes</h3><p>DA9991: Se este código aparecer, significa que as datas de chegada no OTM ainda não foram inseridas. Por favor, insira-as imediatamente.</p><p>DA9993: Se este código aparecer, a data de chegada foi inserida, mas o motivo da antecipação e/ou atraso não foi incluído. Por favor, insira-o no OTM.</p>`,
        quiz:[{q:"O que indica o código de falha DA9991?",options:["A remessa foi entregue no prazo","As datas de chegada no OTM ainda não foram inseridas","Houve uma pane no veículo","O clima causou um atraso"],correct:1},{q:"O que deve fazer quando o código DA9993 aparecer?",options:["Ignorá-lo e continuar","Inserir o motivo da antecipação e/ou atraso no OTM","Cancelar a remessa","Contatar a equipe do armazém"],correct:1}]}
    }
  ],
  'freight-settlement': [
    { id:1, video:null, en:{title:"Freight Settlement Overview",tag:"Module 1",desc:"Coming soon — content will be added shortly.",content:`<h3>Coming Soon</h3><p>This module is under development. Content will be added shortly.</p>`,quiz:[{q:"Placeholder question 1",options:["Option A","Option B","Option C","Option D"],correct:0},{q:"Placeholder question 2",options:["Option A","Option B","Option C","Option D"],correct:0}]}, es:{title:"Resumen de Liquidación de Flete",tag:"Módulo 1",desc:"Próximamente.",content:`<h3>Próximamente</h3><p>Este módulo está en desarrollo.</p>`,quiz:[{q:"Pregunta 1",options:["Opción A","Opción B","Opción C","Opción D"],correct:0},{q:"Pregunta 2",options:["Opción A","Opción B","Opción C","Opción D"],correct:0}]}, pt:{title:"Visão Geral da Liquidação de Frete",tag:"Módulo 1",desc:"Em breve.",content:`<h3>Em breve</h3><p>Este módulo está em desenvolvimento.</p>`,quiz:[{q:"Pergunta 1",options:["Opção A","Opção B","Opção C","Opção D"],correct:0},{q:"Pergunta 2",options:["Opção A","Opção B","Opção C","Opção D"],correct:0}]} }
  ],
  mfa: []
}

const labels = {
  en:{modules:'Modules',finalQuiz:'Final Quiz',prev:'← Previous',next:'Next →',goQuiz:'Go to Final Quiz →',quizTitle:'Final Knowledge Check',quizDesc:'Answer all questions. You need 90% or more to pass.',submit:'Submit Quiz',restart:'Restart',pass:'Congratulations! You passed.',fail:'You did not reach the minimum score of 90%.',review:'Modules to review:',logout:'Logout',selectSection:'Select a training section to begin',glossary:'Glossary',backToSections:'← Back to sections',faultCodesTable:'Fault Codes Table',mfaTitle:'MFA Setup Guide',mfaDesc:'Step-by-step guide to configure Multi-Factor Authentication for OTM access.',noQuiz:'This section has no quiz — it is a reference guide.',code:'Code',category:'Category',description:'Description',downloadPdf:'⬇ PDF'},
  es:{modules:'Módulos',finalQuiz:'Quiz Final',prev:'← Anterior',next:'Siguiente →',goQuiz:'Ir al Quiz Final →',quizTitle:'Verificación Final',quizDesc:'Responde todas las preguntas. Necesitas 90% o más para aprobar.',submit:'Enviar Quiz',restart:'Reiniciar',pass:'¡Felicitaciones! Aprobaste.',fail:'No alcanzaste la puntuación mínima del 90%.',review:'Módulos para revisar:',logout:'Cerrar sesión',selectSection:'Selecciona una sección de capacitación para comenzar',glossary:'Glosario',backToSections:'← Volver a secciones',faultCodesTable:'Tabla de Códigos de Falla',mfaTitle:'Guía de Configuración MFA',mfaDesc:'Guía paso a paso para configurar la Autenticación Multifactor para acceder a OTM.',noQuiz:'Esta sección no tiene quiz — es una guía de referencia.',code:'Código',category:'Categoría',description:'Descripción',downloadPdf:'⬇ PDF'},
  pt:{modules:'Módulos',finalQuiz:'Quiz Final',prev:'← Anterior',next:'Próximo →',goQuiz:'Ir para o Quiz Final →',quizTitle:'Verificação Final',quizDesc:'Responda todas as perguntas. Você precisa de 90% ou mais para passar.',submit:'Enviar Quiz',restart:'Reiniciar',pass:'Parabéns! Você passou.',fail:'Você não atingiu a pontuação mínima de 90%.',review:'Módulos para revisar:',logout:'Sair',selectSection:'Selecione uma seção de treinamento para começar',glossary:'Glossário',backToSections:'← Voltar às seções',faultCodesTable:'Tabela de Códigos de Falha',mfaTitle:'Guia de Configuração MFA',mfaDesc:'Guia passo a passo para configurar a Autenticação Multifator para acesso ao OTM.',noQuiz:'Esta seção não tem quiz — é um guia de referência.',code:'Código',category:'Categoria',description:'Descrição',downloadPdf:'⬇ PDF'}
}

export default function TrainingPage() {
  const [lang, setLang] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const [currentModule, setCurrentModule] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)
  const [showFaultTable, setShowFaultTable] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token') || document.cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1]
    const role = localStorage.getItem('role') || document.cookie.match(/(?:^|;\s*)userRole=([^;]+)/)?.[1]
    const name = localStorage.getItem('name') || decodeURIComponent(document.cookie.match(/(?:^|;\s*)userName=([^;]+)/)?.[1] || '')
    if (!token) { router.push('/login'); return }
    setUserName(name || '')
  }, [])

  function logout() {
    localStorage.clear()
    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'userRole=; path=/; max-age=0'
    document.cookie = 'userName=; path=/; max-age=0'
    router.push('/login')
  }

  function exportPDF() {
    const sectionLabel = sections.find(s => s.slug === activeSection)?.[lang] || activeSection
    const mods = sectionModules
    let html = `<html><head><meta charset="UTF-8"><title>${sectionLabel}</title>
    <style>
      body{font-family:Arial,sans-serif;color:#1a1a2e;margin:40px;line-height:1.6;font-size:12px}
      h1{color:#003865;font-size:20px;border-bottom:2px solid #003865;padding-bottom:8px;margin-bottom:4px}
      h2{color:#003865;font-size:15px;margin-top:28px;margin-bottom:6px}
      h3{color:#005B9A;font-size:12px;margin-top:14px;margin-bottom:4px;font-weight:bold}
      p{margin:4px 0;color:#4A5568}
      ul{margin:4px 0 8px 0;padding-left:18px}
      li{margin-bottom:2px;color:#4A5568}
      .tag{font-size:10px;color:#0078C8;text-transform:uppercase;letter-spacing:1px;font-weight:bold}
      .module{page-break-inside:avoid;margin-bottom:28px;border-left:3px solid #BDD9EF;padding-left:16px}
      .cover{text-align:center;margin-bottom:40px;padding:32px;border:1px solid #BDD9EF;border-radius:8px}
    </style></head><body>
    <div class="cover">
      <h1 style="border:none;font-size:24px">OTM Carriers Training</h1>
      <p style="color:#8A9BB0">${sectionLabel}</p>
      <p style="margin-top:8px;font-size:10px;color:#aaa">${new Date().toLocaleDateString()}</p>
    </div>`

    mods.forEach(m => {
      const d = m[lang]
      html += `<div class="module">
        <div class="tag">${d.tag}</div>
        <h2>${d.title}</h2>
        <p><em>${d.desc}</em></p>
        ${d.content}
      </div>`
    })

    html += `</body></html>`
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 500)
  }
  const tx = labels[lang] || labels.en
  const isMFA = activeSection === 'mfa'
  const sectionModules = activeSection && !isMFA ? modules[activeSection] : []
  const progress = sectionModules.length ? Math.round(((currentModule + 1) / sectionModules.length) * 100) : 0

  async function submitQuiz() {
    let correct = 0; let total = 0; const failedMods = []
    sectionModules.forEach((m, mi) => {
      const d = m[lang]
      let modCorrect = 0
      d.quiz.forEach((q, qi) => {
        total++
        const ans = quizAnswers[`${mi}-${qi}`]
        if (ans === q.correct) { correct++; modCorrect++ }
      })
      if (modCorrect < d.quiz.length) failedMods.push(m[lang].tag + ': ' + m[lang].title)
    })
    const score = Math.round((correct / total) * 100)
    const passed = score >= PASS_SCORE
    setQuizSubmitted(true)
    setQuizResult({ score, passed, failedMods })
    const token = localStorage.getItem('token')
    await fetch('/api/quiz/submit', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ score, passed, answers: quizAnswers, language: lang, section: activeSection })
    })
  }

  function selectSection(slug) {
    setActiveSection(slug); setCurrentModule(0); setShowQuiz(false)
    setShowGlossary(false); setShowFaultTable(false); setQuizAnswers({}); setQuizSubmitted(false); setQuizResult(null)
  }

  if (!lang) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003865] via-[#005B9A] to-[#0078C8]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
        <div className="inline-block bg-[#003865] text-white text-xs font-bold tracking-widest px-4 py-2 rounded mb-6">OTM CARRIERS TRAINING</div>
        <h1 className="text-2xl font-bold text-[#003865] mb-2">Welcome{userName ? `, ${userName}` : ''}</h1>
        <p className="text-gray-400 text-sm mb-8">Choose your language / Elija su idioma / Escolha seu idioma</p>
        <div className="flex gap-4 justify-center">
          {[['en','🇺🇸','English'],['es','🇪🇸','Español'],['pt','🇧🇷','Português']].map(([code,flag,label]) => (
            <button key={code} onClick={() => setLang(code)}
              className="flex-1 flex flex-col items-center gap-2 border-2 border-gray-200 rounded-xl py-4 hover:border-[#003865] hover:bg-[#E8F3FB] transition font-semibold text-[#003865]">
              <span className="text-3xl">{flag}</span><span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003865] text-white px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div><div className="font-bold">OTM Carriers Training</div><div className="text-xs opacity-60">{userName}</div></div>
        <div class="flex items-center gap-3">
          <select value={lang} onChange={e => setLang(e.target.value)} className="bg-white/10 border border-white/20 text-white text-xs rounded-full px-3 py-1 focus:outline-none">
            <option value="en">🇺🇸 EN</option><option value="es">🇪🇸 ES</option><option value="pt">🇧🇷 PT</option>
          </select>
          {activeSection && !isMFA && (
            <button onClick={exportPDF} className="text-xs bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition">{tx.downloadPdf}</button>
          )}
          <button onClick={logout} className="text-xs bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition">{tx.logout}</button>
        </div>
      </header>

      {activeSection && !isMFA && <div className="bg-[#005B9A] h-1"><div className="h-full bg-[#5BC8F5] transition-all duration-500" style={{width: (showQuiz||showGlossary||showFaultTable) ? '100%' : progress+'%'}}></div></div>}

      {!activeSection ? (
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>Training Sections</h2>
          <p className="text-gray-400 mb-10">{tx.selectSection}</p>
          <div className="grid gap-4">
            {sections.map(s => (
              <button key={s.slug} onClick={() => selectSection(s.slug)}
                className="bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md hover:border-[#0078C8] border-2 border-transparent transition group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#0078C8] mb-1">{s.slug.replace(/-/g,' ').toUpperCase()}</div>
                    <div className="text-lg font-bold text-[#003865]">{s[lang]}</div>
                    {s.slug !== 'mfa' && <div className="text-sm text-gray-400 mt-1">{modules[s.slug]?.length || 0} {tx.modules.toLowerCase()}</div>}
                    {s.slug === 'mfa' && <div className="text-sm text-gray-400 mt-1">{tx.noQuiz}</div>}
                  </div>
                  <div className="text-2xl text-gray-200 group-hover:text-[#0078C8] transition">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : isMFA ? (
        // MFA Section
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button onClick={() => setActiveSection(null)} className="text-xs text-gray-400 hover:text-[#003865] transition mb-6 flex items-center gap-1">{tx.backToSections}</button>
          <div className="mb-6">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded mb-3">🔐 MFA</span>
            <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>{tx.mfaTitle}</h2>
            <p className="text-gray-500 text-sm">{tx.mfaDesc}</p>
          </div>
          <div className="space-y-4">
            {mfaSteps[lang].map(s => (
              <div key={s.step} className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#003865] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{s.step}</div>
                <div>
                  <div className="font-bold text-[#003865] mb-1">{s.title}</div>
                  <div className="text-gray-500 text-sm leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex" style={{minHeight:'calc(100vh - 68px)'}}>
          <aside className="w-64 bg-white border-r border-gray-100 py-4 sticky top-16 h-[calc(100vh-68px)] overflow-y-auto hidden md:block flex-shrink-0">
            <button onClick={() => setActiveSection(null)} className="flex items-center gap-2 px-5 py-2 text-xs text-gray-400 hover:text-[#003865] transition mb-2">{tx.backToSections}</button>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 px-5 mb-2">{tx.modules}</div>
            {sectionModules.map((m,i) => (
              <div key={m.id} onClick={() => { setShowQuiz(false); setShowGlossary(false); setShowFaultTable(false); setCurrentModule(i) }}
                className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer border-l-[3px] text-sm font-medium transition ${!showQuiz && !showGlossary && !showFaultTable && i===currentModule ? 'bg-[#E8F3FB] border-[#0078C8] text-[#003865] font-semibold' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
                <span className="text-xs text-gray-400 w-4">{m.id}</span>
                <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
                <span className="truncate">{m[lang].title}</span>
              </div>
            ))}
            {activeSection === 'basic' && (
              <div onClick={() => { setShowGlossary(true); setShowQuiz(false); setShowFaultTable(false) }}
                className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer border-l-[3px] text-sm font-medium transition mt-1 ${showGlossary ? 'bg-[#E8F3FB] border-[#0078C8] text-[#003865] font-semibold' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
                <span className="text-xs text-gray-400 w-4">📖</span>
                <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
                <span>{tx.glossary}</span>
              </div>
            )}
            {activeSection === 'fault-codes' && (
              <div onClick={() => { setShowFaultTable(true); setShowQuiz(false); setShowGlossary(false) }}
                className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer border-l-[3px] text-sm font-medium transition mt-1 ${showFaultTable ? 'bg-[#E8F3FB] border-[#0078C8] text-[#003865] font-semibold' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
                <span className="text-xs text-gray-400 w-4">📋</span>
                <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
                <span>{tx.faultCodesTable}</span>
              </div>
            )}
            <div onClick={() => { setShowQuiz(true); setShowGlossary(false); setShowFaultTable(false) }}
              className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer border-l-[3px] text-sm font-medium transition mt-1 border-t border-gray-100 ${showQuiz ? 'bg-[#E8F3FB] border-[#0078C8] text-[#003865] font-semibold' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
              <span className="text-xs text-gray-400 w-4">★</span>
              <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
              <span>{tx.finalQuiz}</span>
            </div>
          </aside>

          <main className="flex-1 p-8 max-w-3xl">
            {showGlossary ? <GlossaryView lang={lang} tx={tx} glossary={glossary} />
            : showFaultTable ? <FaultCodesView lang={lang} tx={tx} codes={faultCodes} />
            : !showQuiz ? (
              <ModuleView m={sectionModules[currentModule]} lang={lang} tx={tx}
                isLast={currentModule===sectionModules.length-1}
                onPrev={() => setCurrentModule(i => i-1)}
                onNext={() => setCurrentModule(i => i+1)}
                onQuiz={() => setShowQuiz(true)}
                showPrev={currentModule > 0} />
            ) : activeSection === 'fault-codes' ? (
              <div>
                <div className="mb-6">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded mb-3">★ {tx.finalQuiz}</span>
                  <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>{tx.quizTitle}</h2>
                  <p className="text-gray-500 text-sm mb-6">{lang === 'en' ? 'Match each fault code to its correct description by dragging.' : lang === 'es' ? 'Relaciona cada código de falla con su descripción correcta arrastrándola.' : 'Relacione cada código de falha com sua descrição correta arrastando.'}</p>
                </div>
                <FaultCodesDragQuiz lang={lang} onScoreSave={async (score, passed) => {
                  const token = localStorage.getItem('token')
                  await fetch('/api/quiz/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ score, passed, answers: {}, language: lang, section: 'fault-codes' })
                  })
                }} />
              </div>
            ) : (
              <QuizView modules={sectionModules} lang={lang} tx={tx}
                answers={quizAnswers} setAnswers={setQuizAnswers}
                submitted={quizSubmitted} result={quizResult} onSubmit={submitQuiz}
                onRestart={() => { setShowQuiz(false); setCurrentModule(0); setQuizAnswers({}); setQuizSubmitted(false); setQuizResult(null) }} />
            )}
          </main>
        </div>
      )}
    </div>
  )
}

function GlossaryView({ lang, tx, glossary }) {
  const terms = glossary[lang] || glossary.en
  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded mb-3">📖 {tx.glossary}</span>
        <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>{tx.glossary}</h2>
        <p className="text-gray-500 text-sm">{terms.length} terms</p>
      </div>
      <div className="space-y-3">
        {terms.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5">
            <div className="font-bold text-[#003865] mb-1">{item.term}</div>
            <div className="text-gray-500 text-sm leading-relaxed">{item.def}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FaultCodesView({ lang, tx, codes }) {
  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded mb-3">📋 {tx.faultCodesTable}</span>
        <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>{tx.faultCodesTable}</h2>
        <p className="text-gray-500 text-sm">{codes.length} codes</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#003865] text-white">
              <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide">{tx.code}</th>
              <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide">{tx.category}</th>
              <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide">{tx.description}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {codes.map((c, i) => (
              <tr key={i} className={`hover:bg-[#E8F3FB] ${c.code.startsWith('DA999') ? 'bg-amber-50' : ''}`}>
                <td className="px-5 py-3 font-mono font-bold text-[#003865] text-xs whitespace-nowrap">{c.code}</td>
                <td className="px-5 py-3 text-gray-600 text-xs">{c.level}</td>
                <td className="px-5 py-3 text-gray-500 text-xs leading-relaxed">{c[lang] || c.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ModuleView({ m, lang, tx, isLast, onPrev, onNext, onQuiz, showPrev }) {
  const d = m[lang]
  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded mb-3">{d.tag}</span>
        <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>{d.title}</h2>
        <p className="text-gray-500 text-sm">{d.desc}</p>
      </div>
      {m.video && (
        <div className="bg-[#003865] rounded-xl overflow-hidden mb-5 shadow-lg">
          <video controls controlsList="nodownload" onContextMenu={e => e.preventDefault()} className="w-full" style={{aspectRatio:'16/9'}} src={m.video}
            onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML+='<div style="aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#002244,#003865);color:rgba(255,255,255,0.3);font-size:0.85rem">Video not found</div>' }} />
          <div className="px-4 py-2 text-xs text-white/40 border-t border-white/10">{d.tag} — {d.title}</div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-5"
        dangerouslySetInnerHTML={{__html: d.content
          .replace(/<h3>/g,'<h3 style="color:#003865;font-weight:700;font-size:1rem;margin-top:16px;margin-bottom:8px">')
          .replace(/<ul>/g,'<ul style="list-style:disc;padding-left:20px;margin:8px 0">')
          .replace(/<li>/g,'<li style="color:#4A5568;font-size:0.9rem;margin-bottom:4px;line-height:1.6">')
          .replace(/<p>/g,'<p style="color:#4A5568;font-size:0.92rem;line-height:1.7;margin-bottom:12px">')}} />
      <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
        {showPrev && <button onClick={onPrev} className="border border-gray-200 text-gray-600 hover:border-[#0078C8] hover:text-[#0078C8] font-semibold px-5 py-2.5 rounded-lg text-sm transition">{tx.prev}</button>}
        {isLast
          ? <button onClick={onQuiz} className="ml-auto bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">{tx.goQuiz}</button>
          : <button onClick={onNext} className="ml-auto bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">{tx.next}</button>}
      </div>
    </div>
  )
}

function QuizView({ modules, lang, tx, answers, setAnswers, submitted, result, onSubmit, onRestart }) {
  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded mb-3">★ {tx.finalQuiz}</span>
        <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>{tx.quizTitle}</h2>
        <p className="text-gray-500 text-sm">{tx.quizDesc}</p>
      </div>
      {modules.map((m, mi) => {
        const d = m[lang]
        return (
          <div key={m.id} className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#0078C8] mb-4">{d.tag} — {d.title}</div>
            {d.quiz.map((q, qi) => {
              const key = `${mi}-${qi}`
              const userAns = answers[key]
              return (
                <div key={qi} className="mb-5 last:mb-0">
                  <div className="font-semibold text-sm text-[#003865] mb-3"><span className="text-[#0078C8]">Q{mi*2+qi+1}.</span> {q.q}</div>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      let cls = 'border-gray-200 text-gray-600 hover:border-[#0078C8] hover:bg-[#E8F3FB]'
                      if (submitted) {
                        if (oi === q.correct) cls = 'border-green-400 bg-green-50 text-green-700 font-semibold'
                        else if (oi === userAns) cls = 'border-red-400 bg-red-50 text-red-600'
                        else cls = 'border-gray-100 text-gray-400'
                      } else if (userAns === oi) cls = 'border-[#0078C8] bg-[#E8F3FB] text-[#003865] font-medium'
                      return (
                        <label key={oi} className={`flex items-start gap-3 border-2 rounded-lg px-4 py-3 text-sm cursor-pointer transition ${cls}`}>
                          <input type="radio" name={key} value={oi} disabled={submitted}
                            checked={userAns === oi} onChange={() => setAnswers(a => ({...a, [key]: oi}))}
                            className="mt-0.5 flex-shrink-0 accent-[#0078C8]" />
                          {opt}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
      {!submitted && <button onClick={onSubmit} className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-8 py-3 rounded-lg transition mb-8">{tx.submit}</button>}
      {result && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mt-4 mb-8">
          <div className="text-4xl mb-3">{result.passed ? '🎉' : '📋'}</div>
          <div className={`text-5xl font-bold mb-3 ${result.passed ? 'text-green-600' : 'text-red-500'}`}>{result.score}%</div>
          <p className="text-gray-600 mb-4">{result.passed ? tx.pass : tx.fail}</p>
          {!result.passed && result.failedMods.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-left">
              <div className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2">{tx.review}</div>
              <ul className="space-y-1">{result.failedMods.map((m,i) => <li key={i} className="text-sm text-amber-700">→ {m}</li>)}</ul>
            </div>
          )}
          <button onClick={onRestart} className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-6 py-2.5 rounded-lg transition">{tx.restart}</button>
        </div>
      )}
    </div>
  )
}
